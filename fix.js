const fs = require('fs');
let content = fs.readFileSync('src/modules/processes/solicitudes/presentation/pages/SolicitudDetailPage.tsx', 'utf8');
content = content.replace(/<\/div>  <span className="sol-detail-header-nav__subtitle">Creado el \{fechaStr\}<\/span>\n          <\/div>\n        <\/div>/g, 
`          </div>
        </div>
      }`);
content = content.replace(/<div style=\{\{ background: 'black', color: 'lime', padding: 10, fontSize: 10, overflow: 'auto', maxHeight: 200 \}\}>/g,
`<div style={{ background: 'black', color: 'lime', padding: 10, fontSize: 10, overflow: 'auto', maxHeight: 200, position: 'absolute', zIndex: 9999, top: 0, left: 0 }}>`);
fs.writeFileSync('src/modules/processes/solicitudes/presentation/pages/SolicitudDetailPage.tsx', content);
