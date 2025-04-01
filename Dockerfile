FROM php:8.4-fpm-alpine

RUN apk update && apk add --no-cache \
    git \
    zip \
    unzip \
    libzip-dev \
    oniguruma-dev \
    freetype-dev \
    libpng-dev \
    libjpeg-turbo-dev \
    libtool \
    autoconf \
    g++ \
    icu-dev \
    postgresql-dev \
    libxml2-dev \
    curl-dev \
    libev-dev \
    redis \
    gmp-dev \  
    && apk add --no-cache --virtual .build-deps \
    libtool \
    autoconf \
    g++ \
    make \
    && pecl install redis \
    && docker-php-ext-enable redis \
    && apk del .build-deps

RUN docker-php-ext-install -j$(nproc) zip \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) gd \
    && docker-php-ext-install -j$(nproc) pdo_mysql \
    && docker-php-ext-install -j$(nproc) bcmath \
    && docker-php-ext-install -j$(nproc) gmp \  
    && docker-php-ext-install -j$(nproc) mysqli \
    && docker-php-ext-install -j$(nproc) exif \
    && docker-php-ext-install -j$(nproc) pcntl \
    && docker-php-ext-install -j$(nproc) intl \
    && docker-php-ext-install -j$(nproc) dom \
    && docker-php-ext-install -j$(nproc) curl \
    && docker-php-ext-install -j$(nproc) pdo_pgsql

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY composer.* ./

RUN composer install --no-ansi --no-dev --no-interaction --no-scripts --optimize-autoloader

COPY . .

RUN cp .env.example .env

RUN php artisan key:generate

RUN chmod -R 777 storage bootstrap/cache

EXPOSE 8000

CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
