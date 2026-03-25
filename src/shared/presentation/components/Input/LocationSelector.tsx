import React, { useState, useEffect } from 'react';
import { SearchableSelect } from './SearchableSelect';
import { GetCountriesRepositoryImpl } from '@/modules/location/infrastructure/repositories/GetCountriesRepositoryImpl';
import { GetProvincesRepositoryImpl } from '@/modules/location/infrastructure/repositories/GetProvincesRepositoryImpl';
import { GetCantonRepositoryImpl } from '@/modules/location/infrastructure/repositories/GetCantonRepositoryImpl';
import { GetParishRepositoryImpl } from '@/modules/location/infrastructure/repositories/GetParishRepositoryImpl';
import { GetCountriesUseCase } from '@/modules/location/application/usecases/GetCountriesUseCase';
import { GetProvincesUseCase } from '@/modules/location/application/usecases/GetProvincesUseCase';
import { GetCantonUseCase } from '@/modules/location/application/usecases/GetCantonUseCase';
import { GetParishUseCase } from '@/modules/location/application/usecases/GetParishUseCase';
import { apiClient } from '@/shared/infrastructure/api/client/ApiClient';
import type { Country } from '@/modules/location/domain/models/Country';
import type { Province } from '@/modules/location/domain/models/Province';
import type { Canton } from '@/modules/location/domain/models/Canton';
import type { Parish } from '@/modules/location/domain/models/Parish';

interface LocationSelectorProps {
  countryId: string;
  provinceId: string;
  cantonId: string;
  parishId: string;
  onLocationChange: (location: {
    countryId: string;
    provinceId: string;
    cantonId: string;
    parishId: string;
  }) => void;
  label?: string;
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
}

export const LocationSelector: React.FC<LocationSelectorProps> = ({
  countryId,
  provinceId,
  cantonId,
  parishId,
  onLocationChange,
  size = 'medium',
  disabled = false
}) => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [cantons, setCantons] = useState<Canton[]>([]);
  const [parishes, setParishes] = useState<Parish[]>([]);

  const [loading, setLoading] = useState(false);

  // UseCases
  const countriesUseCase = new GetCountriesUseCase(
    new GetCountriesRepositoryImpl(apiClient)
  );
  const provincesUseCase = new GetProvincesUseCase(
    new GetProvincesRepositoryImpl(apiClient)
  );
  const cantonUseCase = new GetCantonUseCase(
    new GetCantonRepositoryImpl(apiClient)
  );
  const parishUseCase = new GetParishUseCase(
    new GetParishRepositoryImpl(apiClient)
  );

  // Initial Load: Countries
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const data = await countriesUseCase.getAllCountries();
        setCountries(data);
        // Default to Ecuador if available (common use case)
        const ecuador = data.find(
          (c) => c.countryName.toLowerCase() === 'ecuador'
        );
        if (ecuador && !countryId) {
          onLocationChange({
            countryId: ecuador.countryId,
            provinceId: '',
            cantonId: '',
            parishId: ''
          });
        }
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };
    fetchCountries();
  }, []);

  // Pre-fill logic when parishId changes externally
  useEffect(() => {
    if (
      parishId &&
      parishId !== 'ECU' &&
      parishId !== '' &&
      (!countryId || !provinceId || !cantonId)
    ) {
      const resolveHierarchy = async () => {
        setLoading(true);
        try {
          const parish = await parishUseCase.getParishById(parishId);
          if (parish) {
            const canton = await cantonUseCase.getCantonById(parish.cantonId);
            if (canton) {
              const province = await provincesUseCase.getProvinceById(
                canton.provinceId
              );
              if (province) {
                onLocationChange({
                  countryId: province.countryId,
                  provinceId: province.provinceId,
                  cantonId: canton.cantonId,
                  parishId: parish.parishId
                });
              }
            }
          }
        } catch (error) {
          console.error('Error resolving location hierarchy:', error);
        } finally {
          setLoading(false);
        }
      };
      resolveHierarchy();
    }
  }, [parishId]);

  // Fetch Provinces when Country changes
  useEffect(() => {
    if (countryId) {
      const fetchProvinces = async () => {
        try {
          const data =
            await provincesUseCase.getProvincesByCountryId(countryId);
          setProvinces(data);
        } catch (error) {
          console.error('Error fetching provinces:', error);
        }
      };
      fetchProvinces();
    } else {
      setProvinces([]);
    }
  }, [countryId]);

  // Fetch Cantons when Province changes
  useEffect(() => {
    if (provinceId) {
      const fetchCantons = async () => {
        try {
          const data = await cantonUseCase.getCantonsByProvinceId(provinceId);
          setCantons(data);
        } catch (error) {
          console.error('Error fetching cantons:', error);
        }
      };
      fetchCantons();
    } else {
      setCantons([]);
    }
  }, [provinceId]);

  // Fetch Parishes when Canton changes
  useEffect(() => {
    if (cantonId) {
      const fetchParishes = async () => {
        try {
          const data = await parishUseCase.getParishesByCantonId(cantonId);
          setParishes(data);
        } catch (error) {
          console.error('Error fetching parishes:', error);
        }
      };
      fetchParishes();
    } else {
      setParishes([]);
    }
  }, [cantonId]);

  return (
    <div
      className="location-selector"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '1rem',
        width: '100%'
      }}
    >
      <SearchableSelect
        label="País"
        size={size}
        value={countryId}
        onChange={(val) => {
          onLocationChange({
            countryId: val as string,
            provinceId: '',
            cantonId: '',
            parishId: ''
          });
        }}
        disabled={disabled || loading}
        options={countries.map((c) => ({
          value: c.countryId,
          label: c.countryName
        }))}
      />
      <SearchableSelect
        label="Provincia"
        size={size}
        value={provinceId}
        onChange={(val) => {
          onLocationChange({
            countryId: countryId,
            provinceId: val as string,
            cantonId: '',
            parishId: ''
          });
        }}
        disabled={disabled || loading || !countryId}
        options={provinces.map((p) => ({
          value: p.provinceId,
          label: p.provinceName
        }))}
      />
      <SearchableSelect
        label="Ciudad/Cantón"
        size={size}
        value={cantonId}
        onChange={(val) => {
          onLocationChange({
            countryId: countryId,
            provinceId: provinceId,
            cantonId: val as string,
            parishId: ''
          });
        }}
        disabled={disabled || loading || !provinceId}
        options={cantons.map((c) => ({
          value: c.cantonId,
          label: c.cantonName
        }))}
      />
      <SearchableSelect
        label="Parroquia"
        size={size}
        value={parishId}
        onChange={(val) =>
          onLocationChange({
            countryId: countryId,
            provinceId: provinceId,
            cantonId: cantonId,
            parishId: val as string
          })
        }
        disabled={disabled || loading || !cantonId}
        options={parishes.map((p) => ({
          value: p.parishId,
          label: p.parishName
        }))}
      />
    </div>
  );
};
