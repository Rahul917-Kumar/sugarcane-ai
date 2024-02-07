import React, { ReactNode } from "react";
import { Controller } from "react-hook-form";
import {
  FormControl,
  FormLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import type { FormInputProps } from "./formInputProps";

interface Props<T extends string | number> extends FormInputProps {
  name: string;
  control: any; // Adjust the type of 'control' based on your requirements
  label: string;
  defaultValue: T | undefined;
  readonly: boolean;
  enumValues: Record<string, T>;
  onChange: (event: SelectChangeEvent<any>, child: ReactNode) => void;
}

export function FormSelectInput<T extends string | number>({
  name,
  control,
  label,
  defaultValue,
  onChange,
  readonly,
  enumValues,
}: Props<T>) {
  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">{label}</FormLabel>
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        // onChange={onChange}
        render={({ ref, ...field }) => (
          <TextField
            select
            required
            variant="outlined"
            inputRef={ref}
            disabled={readonly}
            {...field}
            onChange={(event) =>
              onChange(event as SelectChangeEvent<any>, field)
            }
            // onChange={onChange}
          >
            {Object.entries(enumValues).map(([key, value]) => (
              <MenuItem key={key} value={value}>
                {value}
              </MenuItem>
            ))}
          </TextField>
        )}
      />
    </FormControl>
  );
}
