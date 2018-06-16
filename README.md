# Katerina

CLI АПИ должно уметь восстанавливать json файл из достропримечательностей по заголовку их статьи на Википедии. В конечный файл для каждой достопримечательности должно войти:
* координаты достопримечательности (Вики)
* ключи для загрузки данных по достопримечательности из Вики
    * заголовок статьи (Ручное)
    * ИД страницы (Вики)
* ссылка на официальный сайт достопримечательности если есть (Ручное)
* теги для загрузки изображений из Инстаграмм (Ручное)
Так же CLI должно уметь подгружать восстановленный файл в базу данных как тестовые данные. В самом АПИ такой возможности не будет.

Описание моделей БД
Достопримечательноть SIGHT
- id
- keys
    Map of Object
        key1 [title] String required
        key2 [pageId] Number
- names
    Map of String
- coords
    Object required
        lat Number
        lon Number
- tags
    Array of string
- link
    String allow null regex URL
- rate
    Number 1..10 default 0
- rates
    Array of Number allow null
- comments
    Array of <COMMENT>
- comfirmed
    Boolean default false
- email
    String required regex EMAIL

Комментарий COMMENT
- id
- email
    String required regex EMAIL
- publishAt
    Date required
- name
    String allow null
- flag
    String allow null
- sight
    ID of <SIGHT>
- text
    String required max length 280

Пользователь USER
- id
- email
    String required regex EMAIL
- name
    String required
- password
    String required password
- roles
    Array of <ROLE>
- sinceAt
    Date required

Роль ROLE
- id
- name
    String required enum of Roles

Описание моделей приложения
Достопримечательность SIGHT
- id
- key STRING | NUMBER
- name STRING
- text STRING
- thumbnail STRING (LINK)
- wikiLink STRING (LINK)
- updatedAt DATE
- coords OBJECT { lat, lon }
- tags ARRAY
- link STRING (LINK)
- rate NUMBER
- comments ARRAY

Комментарий COMMENT
- id
- email STRING (EMAIL)
- publishAt DATE
- name STRING
- flag STRING (LINK)
- text STRING

ФУНКЦИИ АПИ

* АПИ связи с WikiMedia
- getSight
    ВХОД ключи по языкам для разных достопримечательностей
    ВЫХОД для каждого языка должно вернуться
        * Название достопримечательности
        * ИД страницы достопримечательности
    для всей достопримечательности должны вернуться координаты
- getSightDetail
    ВХОД ИД страницы (или заголовок, если по какой-то причине ИД страницы неизветен) и язык, для которого запрашивается достопримечательность
    ВЫХОД
        * Короткое описание достопримечательности
        * Изображение достопримечательности
        * Ссылка на страницу достопримечательности в Википедии
        * Дата последнего изменения статьи на Википедии
* KATERINA АПИ для пользователя
- GET /sights/?lang=en
  GET /en/sights
  200 ARRAY<SIGHT>
  204 ARRAY EMPTY
  400
  Описание достопримечательностей из Базы данных. Ключевые данные - координаты и ключ запроса в Википедии. Остальные данные нужны для мгновенного отображения базовой информации пока идут запросы к сторонним АПИ.
- GET /sight/{id}/?lang=en
  GET /en/sight/{id}
  200 SIGHT
  400
  Описание достопримечательностей с данными из Википедии. Так же в модели будет присутствовать поле comments<NUMBER> которое будет отображать количество присутствующий комментарией к достопримечательности. Если поле отсутствует, то комментариев нет.
- GET /sight/{id}/comments
  200 ARRAY<COMMENT>
  204 ARRAY EMPTY
  400
  Получить все комментарии к достопримечательности
- POST /sight/{id}/rate
  [BODY] rate NUMBER
  202 OBJECT { rate: new_rate } or BOOLEAN
  400
  Оценить достопримечательность {id} оценкой {rate}. При этом пересчитывается рейтинг по достопримечательности и новое число возвращается пользователю и сохраняется в базу данных.
  Для этих целей в БД хранится массив со всеми оценками пользователей. Новая оценка добавляется в этот массив и рассчет происходт по формуле
  new_rate = (Array[0] + ... + Array[n - 1] + rate ) / n + 1.
- PUT /sight/{id}/comment
  [BODY] comment COMMENT
  201 BOOLEAN
  400
  Добавить новый комментарий к достопримечательности
- PUT /sight
  [BODY] sight SIGHT
  201 BOOLEAN
  400
  Добавить новую достопримечательность. При этом достопримечательность не попадает сразу на карту. Она сохраняется в базе данных с признаком confirmed=false и становится доступной для одобрения или отклонения в административной части приложения
* KATERINA АПИ для администратора
- POST auth
  [BODY] email password
  200 STRING
  401
  400
  Принимает на вход email и пароль пользователя, авторизует его и возвращает JWT который будет использоваться во всех последующих запросах к административной части API
- GET /sights auth
  200 ARRAY<SIGHTS>
  204 ARRAY EMPTY
  403
  400
  Отображение таблицы с достопримечательностями, которые нуждаются в одобрении
- POST /sights/{id} auth
  202 BOOLEAN
  403
  400
  Одобрить достопримечательность. При этом у нее станет признак confirmed=true. ??? Можно отправить письмо на адрес автора с одобрением предложенной им достопримечательности
- DELETE /sights/{id} auth
  202 BOOLEAN
  403
  400
  Отклонить достопримечательность. При этом она удаляется из БД. ??? Можно отправить письмо автору с информацией о том, что его достопримечательность не прошла проверку.

При помощи тест-раннера JEST и библиотеки ассертов CHAI протестировать каждый метод клиентского и административного АПИ на стестовой базе данных. Так же протестировать часть АПИ отвечающего за связь с WikiMedia АПИ.

??? Надо найти апи для получения флага страны по ее кодовому обозначению. Желательно ссылкой в BASE64, но можно и просто ссылкой.
15.06.2018 Для этих целей, а так же для целей локализации использовано [ipstack](http://api.ipstack.com/)

### I hope you will enjoy it. Max Eremin