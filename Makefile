# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: apommier <apommier@student.42.fr>          +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2023/03/19 09:29:27 by apommier          #+#    #+#              #
#    Updated: 2023/04/04 18:14:43 by apommier         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

all:
# -mkdir -p /home/apommier/data/wordpress
	-mkdir -p /home/apommier/data/pgsql
	docker-compose -f docker-compose.yml up --build

fclean: down
#	-sudo rm -rf /home/apommier/data/wordpress
#	-sudo rm -rf /home/apommier/data/mariadb
	-docker rm $$(docker ps -qa)
	-docker rmi -f $$(docker images -qa)
	-docker volume rm $$(docker volume ls -q)
	-docker network rm $$(docker network ls -q)

volume:
	-docker volume rm $$(docker volume ls -q)
up:
	docker-compose -f ./docker-compose.yml up

back:
	docker-compose -f ./docker-compose.yml up --build -d

down:
	docker-compose -f ./docker-compose.yml down

re: fclean all