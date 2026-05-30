/**
 * Swagger-compatible OpenAPI schema for the L_Shop backend.
 * The schema is served as JSON and powers the visual API documentation page.
 */
export const openApiSpec = {
    openapi: "3.0.3",
    info: {
        title: "L_Shop API",
        version: "1.0.0",
        description: "Документация API интернет-магазина L_Shop."
    },
    servers: [
        {
            url: "http://localhost:8080/api",
            description: "Local backend"
        }
    ],
    tags: [
        { name: "Auth", description: "Регистрация, вход, сессия и восстановление пароля" },
        { name: "Users", description: "Пользователи" },
        { name: "Catalog", description: "Каталог товаров и фильтры" },
        { name: "Basket", description: "Корзина, доставка и заказ" },
        { name: "Banners", description: "Баннеры главной страницы" }
    ],
    paths: {
        "/users": {
            get: {
                tags: ["Users"],
                summary: "Получить всех пользователей",
                responses: {
                    "200": {
                        description: "Список пользователей",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "array",
                                    items: { $ref: "#/components/schemas/User" }
                                }
                            }
                        }
                    }
                }
            }
        },
        "/auth/register": {
            post: {
                tags: ["Auth"],
                summary: "Зарегистрировать пользователя",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/RegisterRequest" }
                        }
                    }
                },
                responses: {
                    "201": {
                        description: "Пользователь создан, cookie currSid установлена",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/AuthUserResponse" }
                            }
                        }
                    },
                    "400": { $ref: "#/components/responses/BadRequest" },
                    "500": { $ref: "#/components/responses/InternalError" }
                }
            }
        },
        "/auth/login": {
            post: {
                tags: ["Auth"],
                summary: "Авторизовать пользователя",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/LoginRequest" }
                        }
                    }
                },
                responses: {
                    "201": {
                        description: "Пользователь авторизован, cookie currSid установлена",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/MessageResponse" }
                            }
                        }
                    },
                    "400": { $ref: "#/components/responses/BadRequest" },
                    "500": { $ref: "#/components/responses/InternalError" }
                }
            }
        },
        "/auth/me": {
            get: {
                tags: ["Auth"],
                summary: "Получить текущего пользователя",
                security: [{ cookieAuth: [] }],
                responses: {
                    "200": {
                        description: "Информация о текущем пользователе",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/UserInfoResponse" }
                            }
                        }
                    },
                    "400": { $ref: "#/components/responses/BadRequest" },
                    "401": { $ref: "#/components/responses/Unauthorized" },
                    "500": { $ref: "#/components/responses/InternalError" }
                }
            },
            patch: {
                tags: ["Auth"],
                summary: "Обновить профиль текущего пользователя",
                security: [{ cookieAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/ProfileUpdateRequest" }
                        }
                    }
                },
                responses: {
                    "200": {
                        description: "Профиль обновлен",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/UserInfoResponse" }
                            }
                        }
                    },
                    "400": { $ref: "#/components/responses/BadRequest" },
                    "401": { $ref: "#/components/responses/Unauthorized" },
                    "500": { $ref: "#/components/responses/InternalError" }
                }
            }
        },
        "/auth/logout": {
            post: {
                tags: ["Auth"],
                summary: "Завершить текущую сессию",
                security: [{ cookieAuth: [] }],
                responses: {
                    "200": {
                        description: "Сессия завершена",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/MessageResponse" }
                            }
                        }
                    }
                }
            }
        },
        "/auth/password-reset/request": {
            post: {
                tags: ["Auth"],
                summary: "Запросить код восстановления пароля",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/PasswordResetRequest" }
                        }
                    }
                },
                responses: {
                    "200": {
                        description: "Ответ не раскрывает существование пользователя",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/MessageResponse" }
                            }
                        }
                    },
                    "400": { $ref: "#/components/responses/BadRequest" },
                    "500": { $ref: "#/components/responses/InternalError" }
                }
            }
        },
        "/auth/password-reset/confirm": {
            post: {
                tags: ["Auth"],
                summary: "Подтвердить код и установить новый пароль",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/PasswordResetConfirmRequest" }
                        }
                    }
                },
                responses: {
                    "200": {
                        description: "Пароль обновлен",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/MessageResponse" }
                            }
                        }
                    },
                    "400": { $ref: "#/components/responses/BadRequest" },
                    "500": { $ref: "#/components/responses/InternalError" }
                }
            }
        },
        "/auth/reset-password": {
            post: {
                tags: ["Auth"],
                summary: "Legacy-запрос кода восстановления",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/PasswordResetRequest" }
                        }
                    }
                },
                responses: {
                    "200": {
                        description: "Код отправлен",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/MessageResponse" }
                            }
                        }
                    },
                    "400": { $ref: "#/components/responses/BadRequest" },
                    "500": { $ref: "#/components/responses/InternalError" }
                }
            }
        },
        "/auth/reset-password-code": {
            post: {
                tags: ["Auth"],
                summary: "Legacy-проверка кода восстановления",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/PasswordCodeRequest" }
                        }
                    }
                },
                responses: {
                    "200": {
                        description: "Код валиден",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/MessageResponse" }
                            }
                        }
                    },
                    "400": { $ref: "#/components/responses/BadRequest" },
                    "500": { $ref: "#/components/responses/InternalError" }
                }
            }
        },
        "/auth/reset-password-new": {
            post: {
                tags: ["Auth"],
                summary: "Legacy-установка нового пароля",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/PasswordUpdateRequest" }
                        }
                    }
                },
                responses: {
                    "200": {
                        description: "Пароль изменен",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/MessageResponse" }
                            }
                        }
                    },
                    "400": { $ref: "#/components/responses/BadRequest" },
                    "500": { $ref: "#/components/responses/InternalError" }
                }
            }
        },
        "/catalog": {
            get: {
                tags: ["Catalog"],
                summary: "Получить каталог товаров",
                parameters: [
                    { name: "title", in: "query", schema: { type: "string" }, description: "Поиск по названию" },
                    { name: "created_from", in: "query", schema: { type: "string" }, description: "Страна-производитель" },
                    { name: "min_price", in: "query", schema: { type: "number" }, description: "Минимальная цена" },
                    { name: "max_price", in: "query", schema: { type: "number" }, description: "Максимальная цена" },
                    { name: "min_weight", in: "query", schema: { type: "number" }, description: "Минимальный вес" },
                    { name: "max_weight", in: "query", schema: { type: "number" }, description: "Максимальный вес" },
                    { name: "is_stock", in: "query", schema: { type: "boolean" }, description: "Только товары в наличии" },
                    { name: "created_date_from", in: "query", schema: { type: "string", format: "date" }, description: "Дата производства от" },
                    { name: "created_date_to", in: "query", schema: { type: "string", format: "date" }, description: "Дата производства до" },
                    { name: "sort", in: "query", schema: { type: "string", enum: ["price", "created_date"] }, description: "Поле сортировки" },
                    { name: "order", in: "query", schema: { type: "string", enum: ["asc", "desc"] }, description: "Порядок сортировки" },
                    { name: "page", in: "query", schema: { type: "integer", minimum: 1, default: 1 }, description: "Номер страницы" },
                    { name: "limit", in: "query", schema: { type: "integer", minimum: 1, default: 20 }, description: "Количество товаров" }
                ],
                responses: {
                    "200": {
                        description: "Список карточек товаров",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "array",
                                    items: { $ref: "#/components/schemas/CatalogItem" }
                                }
                            }
                        }
                    },
                    "400": { $ref: "#/components/responses/BadRequest" },
                    "500": { $ref: "#/components/responses/InternalError" }
                }
            }
        },
        "/catalog/{id}": {
            get: {
                tags: ["Catalog"],
                summary: "Получить товар по идентификатору",
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        schema: { type: "integer" },
                        description: "ID товара"
                    }
                ],
                responses: {
                    "200": {
                        description: "Полная информация о товаре",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/Product" }
                            }
                        }
                    },
                    "400": { $ref: "#/components/responses/BadRequest" },
                    "500": { $ref: "#/components/responses/InternalError" }
                }
            }
        },
        "/catalog/products/created_from": {
            get: {
                tags: ["Catalog"],
                summary: "Получить список стран-производителей",
                responses: {
                    "200": {
                        description: "Уникальные страны-производители",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "array",
                                    items: { type: "string" }
                                }
                            }
                        }
                    },
                    "400": { $ref: "#/components/responses/BadRequest" },
                    "500": { $ref: "#/components/responses/InternalError" }
                }
            }
        },
        "/banners": {
            get: {
                tags: ["Banners"],
                summary: "Получить баннеры главной страницы",
                responses: {
                    "200": {
                        description: "Список баннеров",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "array",
                                    items: { $ref: "#/components/schemas/Banner" }
                                }
                            }
                        }
                    },
                    "400": { $ref: "#/components/responses/BadRequest" },
                    "500": { $ref: "#/components/responses/InternalError" }
                }
            }
        },
        "/basket": {
            get: {
                tags: ["Basket"],
                summary: "Получить корзину текущего пользователя",
                security: [{ cookieAuth: [] }],
                responses: {
                    "200": {
                        description: "Корзина или null",
                        content: {
                            "application/json": {
                                schema: {
                                    oneOf: [
                                        { $ref: "#/components/schemas/Basket" },
                                        { type: "null" }
                                    ]
                                }
                            }
                        }
                    },
                    "400": { $ref: "#/components/responses/BadRequest" },
                    "401": { $ref: "#/components/responses/Unauthorized" },
                    "500": { $ref: "#/components/responses/InternalError" }
                }
            },
            post: {
                tags: ["Basket"],
                summary: "Добавить товар в корзину",
                security: [{ cookieAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/BasketItem" }
                        }
                    }
                },
                responses: {
                    "200": {
                        description: "Товар добавлен",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/MessageResponse" }
                            }
                        }
                    },
                    "400": { $ref: "#/components/responses/BadRequest" },
                    "401": { $ref: "#/components/responses/Unauthorized" },
                    "500": { $ref: "#/components/responses/InternalError" }
                }
            },
            delete: {
                tags: ["Basket"],
                summary: "Удалить товар из корзины",
                security: [{ cookieAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/ProductIdRequest" }
                        }
                    }
                },
                responses: {
                    "200": {
                        description: "Товар удален",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/MessageResponse" }
                            }
                        }
                    },
                    "400": { $ref: "#/components/responses/BadRequest" },
                    "401": { $ref: "#/components/responses/Unauthorized" },
                    "500": { $ref: "#/components/responses/InternalError" }
                }
            }
        },
        "/basket/price": {
            get: {
                tags: ["Basket"],
                summary: "Получить итоговую стоимость корзины",
                security: [{ cookieAuth: [] }],
                responses: {
                    "200": {
                        description: "Итоговая сумма",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/TotalPriceResponse" }
                            }
                        }
                    },
                    "400": { $ref: "#/components/responses/BadRequest" },
                    "401": { $ref: "#/components/responses/Unauthorized" },
                    "500": { $ref: "#/components/responses/InternalError" }
                }
            }
        },
        "/basket/buy": {
            post: {
                tags: ["Basket"],
                summary: "Оформить заказ из корзины",
                security: [{ cookieAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/BuyRequest" }
                        }
                    }
                },
                responses: {
                    "200": {
                        description: "Заказ создан",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/MessageResponse" }
                            }
                        }
                    },
                    "400": { $ref: "#/components/responses/BadRequest" },
                    "401": { $ref: "#/components/responses/Unauthorized" },
                    "500": { $ref: "#/components/responses/InternalError" }
                }
            }
        },
        "/basket/increase": {
            patch: {
                tags: ["Basket"],
                summary: "Увеличить количество товара",
                security: [{ cookieAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/ProductIdRequest" }
                        }
                    }
                },
                responses: {
                    "200": {
                        description: "Количество увеличено",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/MessageResponse" }
                            }
                        }
                    },
                    "400": { $ref: "#/components/responses/BadRequest" },
                    "401": { $ref: "#/components/responses/Unauthorized" },
                    "500": { $ref: "#/components/responses/InternalError" }
                }
            }
        },
        "/basket/decrease": {
            patch: {
                tags: ["Basket"],
                summary: "Уменьшить количество товара",
                security: [{ cookieAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/ProductIdRequest" }
                        }
                    }
                },
                responses: {
                    "200": {
                        description: "Количество уменьшено",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/MessageResponse" }
                            }
                        }
                    },
                    "400": { $ref: "#/components/responses/BadRequest" },
                    "401": { $ref: "#/components/responses/Unauthorized" },
                    "500": { $ref: "#/components/responses/InternalError" }
                }
            }
        },
        "/basket/delivery": {
            post: {
                tags: ["Basket"],
                summary: "Сохранить параметры доставки",
                security: [{ cookieAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/DeliveryRequest" }
                        }
                    }
                },
                responses: {
                    "200": {
                        description: "Доставка обновлена",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/MessageResponse" }
                            }
                        }
                    },
                    "400": { $ref: "#/components/responses/BadRequest" },
                    "401": { $ref: "#/components/responses/Unauthorized" },
                    "500": { $ref: "#/components/responses/InternalError" }
                }
            }
        }
    },
    components: {
        securitySchemes: {
            cookieAuth: {
                type: "apiKey",
                in: "cookie",
                name: "currSid"
            }
        },
        responses: {
            BadRequest: {
                description: "Ошибка валидации или бизнес-правила",
                content: {
                    "application/json": {
                        schema: { $ref: "#/components/schemas/ErrorResponse" }
                    }
                }
            },
            Unauthorized: {
                description: "Пользователь не авторизован",
                content: {
                    "application/json": {
                        schema: { $ref: "#/components/schemas/ErrorResponse" }
                    }
                }
            },
            InternalError: {
                description: "Внутренняя ошибка сервера",
                content: {
                    "application/json": {
                        schema: { $ref: "#/components/schemas/ErrorResponse" }
                    }
                }
            }
        },
        schemas: {
            ErrorResponse: {
                type: "object",
                required: ["error"],
                properties: {
                    error: { type: "string", example: "Unknown error occurred" }
                }
            },
            MessageResponse: {
                type: "object",
                required: ["message"],
                properties: {
                    message: { type: "string", example: "Operation completed" }
                }
            },
            RegisterRequest: {
                type: "object",
                required: ["name", "email", "phone", "password"],
                properties: {
                    name: { type: "string", example: "Ivan" },
                    email: { type: "string", format: "email", example: "ivan@example.com" },
                    phone: { type: "string", example: "+375291111111" },
                    password: { type: "string", format: "password", example: "secret123" }
                }
            },
            LoginRequest: {
                type: "object",
                required: ["email", "password"],
                properties: {
                    email: { type: "string", format: "email", example: "ivan@example.com" },
                    password: { type: "string", format: "password", example: "secret123" }
                }
            },
            ProfileUpdateRequest: {
                type: "object",
                properties: {
                    name: { type: "string", example: "Ivan" },
                    email: { type: "string", format: "email", example: "ivan@example.com" },
                    phone: { type: "string", example: "+375291111111" },
                    password: { type: "string", format: "password", example: "newSecret123" },
                    confirmPassword: { type: "string", format: "password", example: "newSecret123" }
                }
            },
            PasswordResetRequest: {
                type: "object",
                required: ["email"],
                properties: {
                    email: { type: "string", format: "email", example: "ivan@example.com" }
                }
            },
            PasswordCodeRequest: {
                type: "object",
                required: ["email", "code"],
                properties: {
                    email: { type: "string", format: "email", example: "ivan@example.com" },
                    code: { type: "string", example: "123456" }
                }
            },
            PasswordUpdateRequest: {
                type: "object",
                required: ["email", "code", "password"],
                properties: {
                    email: { type: "string", format: "email", example: "ivan@example.com" },
                    code: { type: "string", example: "123456" },
                    password: { type: "string", format: "password", example: "newSecret123" }
                }
            },
            PasswordResetConfirmRequest: {
                allOf: [
                    { $ref: "#/components/schemas/PasswordUpdateRequest" },
                    {
                        type: "object",
                        required: ["confirmPassword"],
                        properties: {
                            confirmPassword: { type: "string", format: "password", example: "newSecret123" }
                        }
                    }
                ]
            },
            AuthUserResponse: {
                type: "object",
                required: ["message", "user"],
                properties: {
                    message: { type: "string", example: "User registered successfully" },
                    user: { $ref: "#/components/schemas/User" }
                }
            },
            User: {
                type: "object",
                required: ["id", "name", "email", "phone", "hashed_password", "created_at"],
                properties: {
                    id: { type: "integer", example: 1772868654888 },
                    name: { type: "string", example: "Ivan" },
                    email: { type: "string", format: "email", example: "ivan@example.com" },
                    phone: { type: "string", example: "+375291111111" },
                    hashed_password: { type: "string", example: "$2b$10$..." },
                    created_at: { type: "string", format: "date", example: "2026-03-07" }
                }
            },
            UserInfo: {
                type: "object",
                required: ["id", "name", "email", "phone", "created_at"],
                properties: {
                    id: { type: "integer", example: 1772868654888 },
                    name: { type: "string", example: "Ivan" },
                    email: { type: "string", format: "email", example: "ivan@example.com" },
                    phone: { type: "string", example: "+375291111111" },
                    created_at: { type: "string", format: "date", example: "2026-03-07" }
                }
            },
            UserInfoResponse: {
                type: "object",
                required: ["userInfo"],
                properties: {
                    userInfo: { $ref: "#/components/schemas/UserInfo" }
                }
            },
            Product: {
                type: "object",
                required: ["id", "title", "price", "created_from", "is_stock", "weight", "created_date", "property", "image_url"],
                properties: {
                    id: { type: "integer", example: 1 },
                    title: { type: "string", example: "Навоз коровий классический" },
                    price: { type: "number", example: 8.5 },
                    created_from: { type: "string", example: "Беларусь" },
                    is_stock: { type: "boolean", example: true },
                    weight: { type: "number", example: 5000 },
                    created_date: { type: "string", format: "date", example: "2025-02-01" },
                    property: {
                        type: "array",
                        items: { type: "string" },
                        example: ["Натуральное органическое удобрение", "Подходит для огорода и теплиц"]
                    },
                    image_url: {
                        type: "array",
                        items: { type: "string", format: "uri" },
                        example: ["https://i.ibb.co/GfC0FpxC/image.png"]
                    }
                }
            },
            CatalogItem: {
                type: "object",
                required: ["id", "title", "price", "image_url", "weight"],
                properties: {
                    id: { type: "integer", example: 1 },
                    title: { type: "string", example: "Навоз коровий классический" },
                    price: { type: "number", example: 8.5 },
                    image_url: {
                        type: "array",
                        items: { type: "string", format: "uri" },
                        example: ["https://i.ibb.co/GfC0FpxC/image.png"]
                    },
                    weight: { type: "number", example: 5000 }
                }
            },
            Banner: {
                type: "object",
                required: ["id", "image_url", "link", "title"],
                properties: {
                    id: { type: "integer", example: 1 },
                    image_url: { type: "string", format: "uri", example: "https://placehold.co/1200x320/eee/999" },
                    link: { type: "string", example: "/catalogue" },
                    title: { type: "string", example: "Акции в каталоге" }
                }
            },
            BasketItem: {
                type: "object",
                required: ["product_id", "weight", "price", "quantity"],
                properties: {
                    id: { type: "integer", example: 1 },
                    product_id: { type: "integer", example: 1 },
                    weight: { type: "number", example: 5000 },
                    price: { type: "number", example: 8.5 },
                    quantity: { type: "integer", minimum: 1, example: 1 }
                }
            },
            Basket: {
                type: "object",
                required: ["user_id", "items"],
                properties: {
                    user_id: { type: "integer", example: 1772868654888 },
                    items: {
                        type: "array",
                        items: { $ref: "#/components/schemas/BasketItem" }
                    },
                    deliveryPrice: { type: "number", example: 100 },
                    deliveryType: { type: "string", enum: ["pickup", "courier"], example: "courier" },
                    postalCode: { type: "string", example: "220000" },
                    address: { type: "string", example: "Минск, пр. Независимости, 1" }
                }
            },
            ProductIdRequest: {
                type: "object",
                required: ["productId"],
                properties: {
                    productId: { type: "integer", example: 1 }
                }
            },
            TotalPriceResponse: {
                type: "object",
                required: ["total"],
                properties: {
                    total: { type: "number", example: 108.5 }
                }
            },
            DeliveryRequest: {
                type: "object",
                required: ["type"],
                properties: {
                    type: { type: "string", enum: ["pickup", "courier"], example: "courier" },
                    postalCode: { type: "string", example: "220000" },
                    address: { type: "string", example: "Минск, пр. Независимости, 1" }
                }
            },
            BuyRequest: {
                type: "object",
                required: ["address", "phone", "email"],
                properties: {
                    address: { type: "string", example: "Минск, пр. Независимости, 1" },
                    phone: { type: "string", example: "+375291111111" },
                    email: { type: "string", format: "email", example: "ivan@example.com" },
                    changeFrom: { type: "number", nullable: true, example: null }
                }
            }
        }
    }
} as const;
