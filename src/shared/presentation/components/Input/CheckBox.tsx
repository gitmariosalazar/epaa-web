interface CheckBoxProps {
  checked: boolean;
  label?: string;
  name: string;
  value: string;
  disabled?: boolean;
  className?: string;
  id?: string;
  color?: string;
  onCheckedChange: (checked: boolean) => void;
}

export const CheckBox = ({
  checked,
  label,
  name,
  value,
  disabled,
  className,
  id,
  color,
  onCheckedChange
}: CheckBoxProps) => {
  return (
    <label className={`checkbox ${className}`} style={{ color }}>
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        name={name}
        value={value}
        id={id}
        onChange={(e) => onCheckedChange(e.target.checked)}
      />
      <span>{label}</span>
    </label>
  );
};
