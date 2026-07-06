import { Provider } from "@/types";

interface ProviderPickerProps {
  selected: Provider;
  onChange: (provider: Provider) => void;
}

export default function ProviderPicker({ selected, onChange }: ProviderPickerProps) {
  const options: { id: Provider; label: string }[] = [
    { id: "google", label: "Google Calendar" },
    { id: "apple", label: "Apple Calendar" },
  ];

  return (
    <div style={{ display: "flex", gap: "8px" }}>
      {options.map((opt) => (
        <button
          key={opt.id}
          onClick={() => onChange(opt.id)}
          className="prompt-btn"
          style={{
            flex: 1,
            fontSize: "13px",
            background:
              selected === opt.id ? "rgba(108, 122, 240, 0.28)" : undefined,
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}