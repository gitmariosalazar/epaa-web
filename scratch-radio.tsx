        <div className="action-modal__radio-group">
          {RESULTS.map((r) => (
            <div
              key={r.value}
              className={`action-modal__radio${state.result === r.value ? ' action-modal__radio--selected' : ''}`}
              style={{ alignItems: 'center', padding: '0.75rem 1rem' }}
              onClick={() => setters.setResult(r.value)}
            >
              <CheckBox
                name="result"
                value={r.value}
                checked={state.result === r.value}
                onCheckedChange={(checked) => setters.setResult(checked ? r.value : '')}
                className="action-modal__custom-checkbox"
              />
              <span className="action-modal__radio-title" style={{ margin: 0 }}>
                {r.label}
              </span>
            </div>
          ))}
        </div>
