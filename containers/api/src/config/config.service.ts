/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   config.service.ts                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: sadjigui <sadjigui@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/04/09 14:53:49 by apommier          #+#    #+#             */
/*   Updated: 2023/06/22 21:19:44 by sadjigui         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const getTypeOrmConfig = (): TypeOrmModuleOptions => ({
	type: 'postgres',
	host: process.env.POSTGRES_HOST || 'postgresql',
	port: parseInt(process.env.POSTGRES_PORT, 10) || 5432,
	username: process.env.POSTGRES_USER || 'postgres',
	password: process.env.POSTGRES_PASSWORD || 'postgres',
	database: process.env.POSTGRES_DATABASE || 'postgres',
	entities: ["dist/**/*.entity.js"],
	// entities: [join(__dirname, '**', '*.entity.{ts,js}')]
	// entities: ['**/*.entity{.ts,.js}'], //basic
	migrationsTableName: 'migration',
	migrations: ['src/migration/*.ts'],
	ssl: process.env.MODE !== 'DEV',
	synchronize: true,
});