/**
 * Utility for Geo-spatial decoding and coordinate handling
 */

export interface Coordinate {
  lat: number;
  lng: number;
}

/**
 * Tries to extract coordinates from a GeoJSON Point object or serialized JSON string.
 * GeoJSON standard order: [longitude, latitude]
 */
function parseGeoJSONPoint(input: unknown): Coordinate | null {
  if (!input) return null;

  let obj: any = input;
  if (typeof input === 'string') {
    const trimmed = input.trim();
    if (!trimmed.startsWith('{') && !trimmed.startsWith('[')) {
      return null;
    }
    try {
      obj = JSON.parse(trimmed);
    } catch {
      return null;
    }
  }

  if (obj && typeof obj === 'object') {
    // Standard GeoJSON Point: { type: "Point", coordinates: [lng, lat] }
    if (Array.isArray(obj.coordinates) && obj.coordinates.length >= 2) {
      const lng = Number(obj.coordinates[0]);
      const lat = Number(obj.coordinates[1]);
      if (!isNaN(lat) && !isNaN(lng) && !(lat === 0 && lng === 0)) {
        return { lat, lng };
      }
    }

    // Direct { lat, lng } or { latitude, longitude } properties
    const lat = Number(obj.lat ?? obj.latitude);
    const lng = Number(obj.lng ?? obj.longitude);
    if (!isNaN(lat) && !isNaN(lng) && !(lat === 0 && lng === 0)) {
      return { lat, lng };
    }
  }

  return null;
}

/**
 * Decodes a PostGIS EWKB (Extended Well-Known Binary) Point in Hex format
 * OR a GeoJSON Point (as an object or serialized JSON string) to a Latitude/Longitude coordinate object.
 *
 * EWKB Format:
 * [1 byte]: Endianness (0x01 = Little Endian, 0x00 = Big Endian)
 * [4 bytes]: Geometry Type (Point = 0x01, SRID flag = 0x20000000)
 * [4 bytes]: SRID (if flag set, e.g., 4326 for WGS84)
 * [8 bytes]: Double X (Longitude)
 * [8 bytes]: Double Y (Latitude)
 *
 * @param hex The hexadecimal EWKB string, GeoJSON object or serialized JSON
 * @returns Coordinate object or null if invalid
 */
export function decodeEWKBPoint(hex: unknown): Coordinate | null {
  if (!hex) return null;

  // 1. Try GeoJSON first (either JS object or JSON string)
  const geoJsonCoord = parseGeoJSONPoint(hex);
  if (geoJsonCoord) {
    return geoJsonCoord;
  }

  // 2. Fall back to standard EWKB Hex decoding
  if (typeof hex !== 'string' || hex.length < 50) return null;

  try {
    // Remove potential whitespace or 0x prefix
    const cleanHex = hex.replace(/^0x/, '').trim();
    const match = cleanHex.match(/.{1,2}/g);

    if (!match) return null;

    const bytes = new Uint8Array(match.map((byte) => parseInt(byte, 16)));
    const view = new DataView(bytes.buffer);

    // Byte 0: Endianness
    const littleEndian = view.getUint8(0) === 1;

    let cursor = 1;

    // Bytes 1-4: Geometry Type + Optional SRID Flag
    const type = view.getUint32(cursor, littleEndian);
    cursor += 4;

    const hasSRID = (type & 0x20000000) !== 0;

    if (hasSRID) {
      // Decode SRID if flag is present (usually 4326 for web maps)
      const srid = view.getUint32(cursor, littleEndian);
      if (srid !== 4326) {
        console.warn(`Unexpected SRID in EWKB: ${srid}. Map expects 4326.`);
      }
      cursor += 4;
    }

    // Coordinates are always 8-byte Doubles (X, Y)
    // X is Longitude, Y is Latitude
    const lng = view.getFloat64(cursor, littleEndian);
    cursor += 8;
    const lat = view.getFloat64(cursor, littleEndian);

    // Sanity check
    if (isNaN(lat) || isNaN(lng)) return null;
    if (lat === 0 && lng === 0) return null; // Often used for empty points

    return { lat, lng };
  } catch (error) {
    console.error('Failed to decode EWKB Point:', error);
    return null;
  }
}
