// src/hooks/useFormValidation.ts
import { useState, useCallback } from 'react';
import useI18n from './useI18n';


interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => string | null;
}

interface ValidationRules {
  [key: string]: ValidationRule;
}

interface ValidationErrors {
  [key: string]: string;
}

export const useFormValidation = <T extends Record<string, any>>(
  initialData: T,
  rules: ValidationRules
) => {
  const { t } = useI18n();
  const [data, setData] = useState<T>(initialData);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Valider un champ spécifique
  const validateField = useCallback((field: string, value: string): string | null => {
    const rule = rules[field];
    if (!rule) return null;

    // Required validation
    if (rule.required && (!value || value.trim() === '')) {
      return t('validation.required', { field });
    }

    // Skip other validations if value is empty and not required
    if (!value || value.trim() === '') {
      return null;
    }

    // Min length validation
    if (rule.minLength && value.length < rule.minLength) {
      return t('validation.min_length', { field, min: rule.minLength });
    }

    // Max length validation
    if (rule.maxLength && value.length > rule.maxLength) {
      return t('validation.max_length', { field, max: rule.maxLength });
    }

    // Pattern validation
    if (rule.pattern && !rule.pattern.test(value)) {
      return t('validation.invalid_format', { field });
    }

    // Custom validation
    if (rule.custom) {
      return rule.custom(value);
    }

    return null;
  }, [rules, t]);

  // Valider tous les champs
  const validateAll = useCallback((): boolean => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    Object.keys(rules).forEach(field => {
      const value = data[field] || '';
      const error = validateField(field, value);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [data, rules, validateField]);

  // Mettre à jour un champ
  const updateField = useCallback((field: keyof T, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
    
    // Marquer comme touché
    setTouched(prev => ({ ...prev, [field]: true }));

    // Valider le champ si déjà touché
    if (touched[field as string]) {
      const error = validateField(field as string, value);
      setErrors(prev => ({ ...prev, [field]: error || '' }));
    }
  }, [touched, validateField]);

  // Marquer un champ comme touché
  const touchField = useCallback((field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    
    const value = data[field] || '';
    const error = validateField(field, value);
    setErrors(prev => ({ ...prev, [field]: error || '' }));
  }, [data, validateField]);

  // Réinitialiser le formulaire
  const reset = useCallback((newData?: T) => {
    setData(newData || initialData);
    setErrors({});
    setTouched({});
  }, [initialData]);

  // Vérifier si le formulaire est valide
  const isValid = Object.values(errors).every(error => !error);

  // Vérifier si le formulaire a des changements
  const isDirty = JSON.stringify(data) !== JSON.stringify(initialData);

  return {
    data,
    errors,
    touched,
    isValid,
    isDirty,
    updateField,
    touchField,
    validateAll,
    reset
  };
};

// Règles de validation prédéfinies pour le profil
export const profileValidationRules: ValidationRules = {
  name: {
    required: true,
    minLength: 2,
    maxLength: 50
  },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    custom: (value: string) => {
      if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return 'Format d\'email invalide';
      }
      return null;
    }
  },
  phone: {
    minLength: 8,
    maxLength: 15,
    pattern: /^[\+]?[1-9][\d]{0,15}$/
  },
  department: {
    maxLength: 100
  },
  bio: {
    maxLength: 500
  }
};