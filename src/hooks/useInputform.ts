import { useState } from "react";

export function useInputform(defaultValue: number) {
  // 1. Typ auf number | string erweitern
  const [value, setValue] = useState<number | string>(defaultValue);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = event.target.value;

    // 2. Fall: Input wird komplett geleert
    if (rawValue === "") {
      setValue(""); // State auf leeren String setzen, damit das Input leer wird!
      setError("Bitte eine Zahl eingeben");
      return;
    }

    const parsedValue = parseInt(rawValue, 10);

    if (Number.isNaN(parsedValue)) {
      setValue(rawValue); // Wert übernehmen, damit der fehlerhafte Text sichtbar bleibt
      setError(`${rawValue} ist keine gültige Zahl`);
    } else if (parsedValue < 0) {
      setValue(parsedValue);
      setError("Wert darf nicht negativ sein");
    } else {
      setValue(parsedValue);
      setError(null);
    }
  };

  return [value, handleChange, error] as const;
}
