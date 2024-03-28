import { SetMetadata } from '@nestjs/common';

// Ключ для метаданных, указывающих, является ли маршрут публичным
export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Декоратор для установки метаданных маршрута в 'isPublic: true'.
 * Можно использовать для указания того, что маршрут должен быть доступен без аутентификации.
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
