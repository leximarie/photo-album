import { useCallback, useEffect, useState } from "react";

export type FormConfig = {
    [key:string]: {
        defaultValue?: any,
        validator?: (value: any) => string | boolean
    }
};

export const useForm = (config: FormConfig) => {
    const [form, setForm] = useState({});

    useEffect(() => {
        setForm(Object.keys(config).reduce((acc, control) => {
            acc[control] = {
                value: config[control].defaultValue,
                error: ""
            }
            return acc;
        }, {}));
    }, [config]);

    const updateForm = useCallback((control: string, value: any) => {
        const validator = config[control].validator || ((value) => false);
        const error = validator(value);
        setForm((old) => ({
            ...old,
            [control]: {
                value: value,
                error: Boolean(error) ? error : ""
            }
        }))
    }, [config]);
    
    return [form, updateForm];
};
