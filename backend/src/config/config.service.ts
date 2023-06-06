/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   config.service.ts                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: apommier <apommier@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/04/09 14:53:49 by apommier          #+#    #+#             */
/*   Updated: 2023/04/09 14:55:40 by apommier         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { TypeOrmModuleOptions } from '@nestjs/typeorm';
	export const getTypeOrmConfig = (): TypeOrmModuleOptions => ({
	type: 'postgres',
	host: 'postgresql',
	port: 5432,
	username: 'postgres',
	password: 'pass',
	database: 'postgres',
	entities: ['**/*.entity{.ts,.js}'],
	migrationsTableName: 'migration',
	migrations: ['src/migration/*.ts'],
	ssl: process.env.MODE !== 'DEV',
	synchronize: true,
	});