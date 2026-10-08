--
-- PostgreSQL database dump
--

\restrict m3Wra6i0xf86Oi4X8Bbg3ZZQ4ZUtfvTUErtXsck9jClq6AXt0KniARbublDPwTz

-- Dumped from database version 15.15 (Homebrew)
-- Dumped by pg_dump version 15.15 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY public.wishlist_items DROP CONSTRAINT IF EXISTS "wishlist_items_customerId_fkey";
ALTER TABLE IF EXISTS ONLY public.products DROP CONSTRAINT IF EXISTS "products_categoryId_fkey";
ALTER TABLE IF EXISTS ONLY public.orders DROP CONSTRAINT IF EXISTS "orders_customerId_fkey";
ALTER TABLE IF EXISTS ONLY public.order_items DROP CONSTRAINT IF EXISTS "order_items_orderId_fkey";
ALTER TABLE IF EXISTS ONLY public.cart_items DROP CONSTRAINT IF EXISTS "cart_items_customerId_fkey";
ALTER TABLE IF EXISTS ONLY public.addresses DROP CONSTRAINT IF EXISTS "addresses_customerId_fkey";
DROP INDEX IF EXISTS public."wishlist_items_customerId_productId_key";
DROP INDEX IF EXISTS public.users_email_key;
DROP INDEX IF EXISTS public.products_slug_key;
DROP INDEX IF EXISTS public."orders_orderNumber_key";
DROP INDEX IF EXISTS public."orders_merchantTxnId_key";
DROP INDEX IF EXISTS public.customers_phone_key;
DROP INDEX IF EXISTS public.customers_email_key;
DROP INDEX IF EXISTS public.categories_slug_key;
DROP INDEX IF EXISTS public.categories_name_key;
DROP INDEX IF EXISTS public."cart_items_customerId_productId_size_color_key";
ALTER TABLE IF EXISTS ONLY public.wishlist_items DROP CONSTRAINT IF EXISTS wishlist_items_pkey;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_pkey;
ALTER TABLE IF EXISTS ONLY public.site_configs DROP CONSTRAINT IF EXISTS site_configs_pkey;
ALTER TABLE IF EXISTS ONLY public.products DROP CONSTRAINT IF EXISTS products_pkey;
ALTER TABLE IF EXISTS ONLY public.orders DROP CONSTRAINT IF EXISTS orders_pkey;
ALTER TABLE IF EXISTS ONLY public.order_items DROP CONSTRAINT IF EXISTS order_items_pkey;
ALTER TABLE IF EXISTS ONLY public.customers DROP CONSTRAINT IF EXISTS customers_pkey;
ALTER TABLE IF EXISTS ONLY public.categories DROP CONSTRAINT IF EXISTS categories_pkey;
ALTER TABLE IF EXISTS ONLY public.cart_items DROP CONSTRAINT IF EXISTS cart_items_pkey;
ALTER TABLE IF EXISTS ONLY public.addresses DROP CONSTRAINT IF EXISTS addresses_pkey;
DROP TABLE IF EXISTS public.wishlist_items;
DROP TABLE IF EXISTS public.users;
DROP TABLE IF EXISTS public.site_configs;
DROP TABLE IF EXISTS public.products;
DROP TABLE IF EXISTS public.orders;
DROP TABLE IF EXISTS public.order_items;
DROP TABLE IF EXISTS public.customers;
DROP TABLE IF EXISTS public.categories;
DROP TABLE IF EXISTS public.cart_items;
DROP TABLE IF EXISTS public.addresses;
SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: addresses; Type: TABLE; Schema: public; Owner: saadhan
--

CREATE TABLE public.addresses (
    id text NOT NULL,
    "customerId" text NOT NULL,
    label text,
    "fullName" text NOT NULL,
    phone text NOT NULL,
    line1 text NOT NULL,
    line2 text,
    city text NOT NULL,
    state text NOT NULL,
    pincode text NOT NULL,
    "isDefault" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.addresses OWNER TO saadhan;

--
-- Name: cart_items; Type: TABLE; Schema: public; Owner: saadhan
--

CREATE TABLE public.cart_items (
    id text NOT NULL,
    "customerId" text NOT NULL,
    "productId" text NOT NULL,
    size text,
    color text,
    quantity integer DEFAULT 1 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.cart_items OWNER TO saadhan;

--
-- Name: categories; Type: TABLE; Schema: public; Owner: saadhan
--

CREATE TABLE public.categories (
    id text NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    description text,
    image text,
    "sortOrder" integer DEFAULT 1 NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.categories OWNER TO saadhan;

--
-- Name: customers; Type: TABLE; Schema: public; Owner: saadhan
--

CREATE TABLE public.customers (
    id text NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    phone text,
    password text NOT NULL,
    "emailVerified" boolean DEFAULT false NOT NULL,
    "emailVerifyToken" text,
    "emailVerifyExpiry" timestamp(3) without time zone,
    "resetToken" text,
    "resetTokenExpiry" timestamp(3) without time zone,
    "failedLoginAttempts" integer DEFAULT 0 NOT NULL,
    "lockedUntil" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.customers OWNER TO saadhan;

--
-- Name: order_items; Type: TABLE; Schema: public; Owner: saadhan
--

CREATE TABLE public.order_items (
    id text NOT NULL,
    "orderId" text NOT NULL,
    "productId" text NOT NULL,
    name text NOT NULL,
    price double precision NOT NULL,
    size text,
    color text,
    quantity integer NOT NULL
);


ALTER TABLE public.order_items OWNER TO saadhan;

--
-- Name: orders; Type: TABLE; Schema: public; Owner: saadhan
--

CREATE TABLE public.orders (
    id text NOT NULL,
    "orderNumber" text,
    "customerName" text,
    email text,
    phone text,
    "shippingAddress" jsonb NOT NULL,
    subtotal double precision NOT NULL,
    "shippingFee" double precision DEFAULT 0 NOT NULL,
    discount double precision DEFAULT 0 NOT NULL,
    total double precision NOT NULL,
    "paymentMethod" text DEFAULT 'phonepe'::text NOT NULL,
    "paymentStatus" text DEFAULT 'initiated'::text NOT NULL,
    "orderStatus" text DEFAULT 'Processing'::text NOT NULL,
    "trackingNumber" text,
    notes text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "customerId" text,
    "merchantTxnId" text,
    "paymentProvider" text DEFAULT 'phonepe'::text NOT NULL,
    "phonepeTxnId" text,
    status text DEFAULT 'pending'::text NOT NULL
);


ALTER TABLE public.orders OWNER TO saadhan;

--
-- Name: products; Type: TABLE; Schema: public; Owner: saadhan
--

CREATE TABLE public.products (
    id text NOT NULL,
    slug text NOT NULL,
    name text NOT NULL,
    category text NOT NULL,
    "categoryId" text,
    color text,
    price double precision NOT NULL,
    "originalPrice" double precision,
    badge text,
    images jsonb DEFAULT '[]'::jsonb NOT NULL,
    sizes jsonb DEFAULT '[]'::jsonb NOT NULL,
    "colorVariants" jsonb DEFAULT '[]'::jsonb,
    "isFeatured" boolean DEFAULT false NOT NULL,
    "isWinterDrop" boolean DEFAULT false NOT NULL,
    "inStock" boolean DEFAULT true NOT NULL,
    "stockStatus" text DEFAULT 'In Stock'::text NOT NULL,
    "fabricDetails" text,
    "careInstructions" text,
    description text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    stock integer DEFAULT 50 NOT NULL
);


ALTER TABLE public.products OWNER TO saadhan;

--
-- Name: site_configs; Type: TABLE; Schema: public; Owner: saadhan
--

CREATE TABLE public.site_configs (
    id text NOT NULL,
    "marqueeText" text,
    "archiveText" text,
    "heroHeadline" text,
    "heroSubheadline" text,
    "heroImage" text,
    "heroDropTag" text,
    "showWinterDrop" boolean DEFAULT true NOT NULL,
    "winterDropTitle" text,
    "winterDropSubtitle" text,
    "winterDropCta" text,
    "winterDropImage" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.site_configs OWNER TO saadhan;

--
-- Name: users; Type: TABLE; Schema: public; Owner: saadhan
--

CREATE TABLE public.users (
    id text NOT NULL,
    name text DEFAULT 'Atelier Administrator'::text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    role text DEFAULT 'customer'::text NOT NULL,
    "mfaSecret" text,
    "mfaEnabled" boolean DEFAULT false NOT NULL,
    "backupCodes" jsonb,
    "failedLoginAttempts" integer DEFAULT 0 NOT NULL,
    "lockedUntil" timestamp(3) without time zone,
    "createdById" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "lastLoginAt" timestamp(3) without time zone,
    "tempPassword" boolean DEFAULT false NOT NULL
);


ALTER TABLE public.users OWNER TO saadhan;

--
-- Name: wishlist_items; Type: TABLE; Schema: public; Owner: saadhan
--

CREATE TABLE public.wishlist_items (
    id text NOT NULL,
    "customerId" text NOT NULL,
    "productId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.wishlist_items OWNER TO saadhan;

--
-- Data for Name: addresses; Type: TABLE DATA; Schema: public; Owner: saadhan
--

COPY public.addresses (id, "customerId", label, "fullName", phone, line1, line2, city, state, pincode, "isDefault", "createdAt") FROM stdin;
cbce02c6-d84e-463b-9b2a-ab6c8ccc960b	1e63bc97-9b1a-4c77-bdce-c52931d0f4b2	Home	Saadhan P	09620937798	590/b 1st cross 1st main	\N	MYSURU	Karnataka	570031	t	2026-10-06 14:10:35.612
\.


--
-- Data for Name: cart_items; Type: TABLE DATA; Schema: public; Owner: saadhan
--

COPY public.cart_items (id, "customerId", "productId", size, color, quantity, "createdAt") FROM stdin;
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: saadhan
--

COPY public.categories (id, name, slug, description, image, "sortOrder", "isActive", "createdAt", "updatedAt") FROM stdin;
d0eeae96-eeda-4c00-aa43-2f2d1746903d	Shirts	shirts	Curated casual, camp collar, and oxford button downs	\N	1	t	2026-10-05 15:44:34.414	2026-10-05 15:44:34.414
209d5bab-ec1d-48d8-90f4-874c2b90c35a	Jackets	jackets	Structured outerwear, bombers, and winter drop staples	\N	2	t	2026-10-05 15:44:34.416	2026-10-05 15:44:34.416
33150d77-3ef5-4063-a01e-68c50aec9018	Tees	tees	Heavyweight organic cotton staples & boxy cuts	\N	3	t	2026-10-05 15:44:34.417	2026-10-05 15:44:34.417
514b828b-77da-4f6b-af12-7e41968dddd6	Tailoring	tailoring	Bespoke fit suits, blazers, and formal trousers	\N	4	t	2026-10-05 15:44:34.417	2026-10-05 15:44:34.417
2ba0976a-4da3-45b8-99ba-b3f551444403	Jeans	jeans	Selvedge and contemporary denim cuts	\N	5	t	2026-10-05 15:44:34.418	2026-10-05 15:44:34.418
a3e6e835-c411-4de2-92ca-3f56d8b00d95	Accessories	accessories	Full-grain leather belts, silk ties, and pocket squares	\N	8	t	2026-10-05 15:44:34.421	2026-10-05 15:44:34.421
31dc345a-c6bb-4b51-9b24-fbd6278f47ea	Formals	formals	Evening shirts, tuxedos, and black-tie essentials	\N	9	t	2026-10-05 15:44:34.421	2026-10-05 15:44:34.421
\.


--
-- Data for Name: customers; Type: TABLE DATA; Schema: public; Owner: saadhan
--

COPY public.customers (id, name, email, phone, password, "emailVerified", "emailVerifyToken", "emailVerifyExpiry", "resetToken", "resetTokenExpiry", "failedLoginAttempts", "lockedUntil", "createdAt", "updatedAt") FROM stdin;
1e63bc97-9b1a-4c77-bdce-c52931d0f4b2	Test Customer	tester@penguin.com	9876543210	$2b$12$mKMTjiLmn2NnOX3LWxYoSO4vx8OGWBpFEGjOamzFqAYmz/OTnQ2kO	f	454c993dd8cc8b9f9187244a432cc9d88c740467e9a07098942d2053b471cb47	2026-10-07 13:36:53.813	79ba3fe024d79cd2d1f238cdd86c98224cc9d1ce86f141142c80cb43abe8c780	2026-10-06 14:37:05.374	0	\N	2026-10-06 13:36:53.815	2026-10-06 13:37:05.374
dd565057-830f-41c5-aaad-fc78fb8232bd	Aiden Croft	aiden@penguin.com	9811223344	$2b$12$xRouW2juC7eRmNBaBIUMSODb4VQugjvfwvOrBOq3On9aYj7gvL0Wa	t	\N	\N	\N	\N	0	\N	2026-10-06 14:22:23.966	2026-10-06 14:22:51.654
1cf6414e-91eb-4c1d-936c-7a7e0a48a541	Saadhan P	saadhan275@gmail.com	09620937798	$2b$12$PV0SoTbYrD.XGNalfE763eqL0JUU3GOLOpOcX8NwLSuWkQ6GmL72O	t	\N	\N	\N	\N	0	\N	2026-10-06 13:43:47.583	2026-10-07 15:52:56.759
\.


--
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: saadhan
--

COPY public.order_items (id, "orderId", "productId", name, price, size, color, quantity) FROM stdin;
14789812-da0d-41b2-bb2c-503e1c6adb86	67fad4bc-0ef6-431c-90d8-c0169cb26035	prod_1791293829990	Structured Poplin Shirt	1999	M	Default	1
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: saadhan
--

COPY public.orders (id, "orderNumber", "customerName", email, phone, "shippingAddress", subtotal, "shippingFee", discount, total, "paymentMethod", "paymentStatus", "orderStatus", "trackingNumber", notes, "createdAt", "updatedAt", "customerId", "merchantTxnId", "paymentProvider", "phonepeTxnId", status) FROM stdin;
67fad4bc-0ef6-431c-90d8-c0169cb26035	PGN-829991-902	Test User	tester@penguin.com	9876543210	{"city": "Mumbai", "name": "Test User", "email": "tester@penguin.com", "line1": "123 Fashion Blvd", "phone": "9876543210", "state": "Maharashtra", "pincode": "400050"}	1999	0	0	1999	cod	pending	Processing	EXP-19616806	\N	2026-10-06 13:37:09.992	2026-10-06 16:40:48.449	\N	\N	cod	\N	pending
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: saadhan
--

COPY public.products (id, slug, name, category, "categoryId", color, price, "originalPrice", badge, images, sizes, "colorVariants", "isFeatured", "isWinterDrop", "inStock", "stockStatus", "fabricDetails", "careInstructions", description, "createdAt", "updatedAt", stock) FROM stdin;
845b40f5-c96a-4c45-b20c-9c4be7d5c27f	essential-plain-black-poplin-shirt	Essential Plain Black Poplin Shirt	Shirts	d0eeae96-eeda-4c00-aa43-2f2d1746903d	Plain Black	1899	2999	ESSENTIAL	["https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=800&auto=format&fit=crop&q=80"]	[{"size": "S", "stock": 12, "isSoldOut": false}, {"size": "M", "stock": 24, "isSoldOut": false}, {"size": "L", "stock": 18, "isSoldOut": false}, {"size": "XL", "stock": 10, "isSoldOut": false}, {"size": "XXL", "stock": 6, "isSoldOut": false}]	[{"hex": "#111111", "name": "Plain Black"}, {"hex": "#F5F5F0", "name": "Chalk White"}]	t	f	t	In Stock	100% High-Density Poplin Cotton (140 GSM). Smooth matte finish.	Machine wash delicate at 30°C. Low heat iron.	A timeless basic poplin shirt with clean proportions, tonal matte buttons, and a crisp point collar.	2026-10-06 15:48:23.877	2026-10-06 15:48:23.877	50
160be25a-895c-4787-8622-6e0ce805870d	minimalist-crisp-white-oxford-shirt	Minimalist Crisp White Oxford Shirt	Shirts	d0eeae96-eeda-4c00-aa43-2f2d1746903d	Crisp White	1799	2899	BESTSELLER	["https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop&q=80"]	[{"size": "S", "stock": 12, "isSoldOut": false}, {"size": "M", "stock": 24, "isSoldOut": false}, {"size": "L", "stock": 18, "isSoldOut": false}, {"size": "XL", "stock": 10, "isSoldOut": false}, {"size": "XXL", "stock": 6, "isSoldOut": false}]	[{"hex": "#FFFFFF", "name": "Crisp White"}, {"hex": "#A8C4D4", "name": "Sky Blue"}]	t	f	t	In Stock	100% Ring-Spun Oxford Cotton (160 GSM). Breathable woven basketweave.	Machine wash 40°C. Medium iron.	Clean button-down collar Oxford shirt with structured casual drape.	2026-10-06 15:48:23.881	2026-10-06 15:48:23.881	50
f91f044a-9b76-4b4a-9d72-c2eca2d3c5a6	classic-charcoal-linen-shirt	Classic Charcoal Linen Shirt	Shirts	d0eeae96-eeda-4c00-aa43-2f2d1746903d	Charcoal Grey	2199	3499	NEW	["https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80"]	[{"size": "S", "stock": 12, "isSoldOut": false}, {"size": "M", "stock": 24, "isSoldOut": false}, {"size": "L", "stock": 18, "isSoldOut": false}, {"size": "XL", "stock": 10, "isSoldOut": false}, {"size": "XXL", "stock": 6, "isSoldOut": false}]	[{"hex": "#333333", "name": "Charcoal Grey"}, {"hex": "#111111", "name": "Plain Black"}]	f	f	t	In Stock	100% Pure Washed European Linen (150 GSM).	Cold hand wash or machine gentle. Line dry.	Breathable washed linen shirt designed for effortless year-round styling.	2026-10-06 15:48:23.882	2026-10-06 15:48:23.882	50
7ca1f64f-b5b8-4ac0-a4b7-4df7f51cde3b	relaxed-navy-camp-collar-shirt	Relaxed Navy Camp Collar Shirt	Shirts	d0eeae96-eeda-4c00-aa43-2f2d1746903d	Deep Navy	1699	2699	POPULAR	["https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop&q=80"]	[{"size": "S", "stock": 12, "isSoldOut": false}, {"size": "M", "stock": 24, "isSoldOut": false}, {"size": "L", "stock": 18, "isSoldOut": false}, {"size": "XL", "stock": 10, "isSoldOut": false}, {"size": "XXL", "stock": 6, "isSoldOut": false}]	[{"hex": "#1A2040", "name": "Deep Navy"}, {"hex": "#111111", "name": "Plain Black"}]	f	f	t	In Stock	100% Breathable Rayon Poplin (130 GSM). Silky matte drape.	Machine wash 30°C. Cool iron.	Relaxed camp collar silhouette in deep navy for refined casual wear.	2026-10-06 15:48:23.883	2026-10-06 15:48:23.883	50
f8b8097a-9bc4-4555-87e9-1220d2f34266	clean-slate-grey-minimalist-tee	Clean Slate Grey Minimalist Tee	Tees	33150d77-3ef5-4063-a01e-68c50aec9018	Slate Grey	999	1699	BASIC	["https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80"]	[{"size": "S", "stock": 12, "isSoldOut": false}, {"size": "M", "stock": 24, "isSoldOut": false}, {"size": "L", "stock": 18, "isSoldOut": false}, {"size": "XL", "stock": 10, "isSoldOut": false}, {"size": "XXL", "stock": 6, "isSoldOut": false}]	[{"hex": "#6A7079", "name": "Slate Grey"}, {"hex": "#111111", "name": "Plain Black"}]	f	f	t	In Stock	190 GSM 100% Cotton.	Machine wash 30°C.	Understated slate grey basic tee tailored for everyday comfort.	2026-10-06 15:48:23.89	2026-10-06 15:48:23.89	50
5a7857fd-cc0a-4091-94f0-5f37adcdf9f2	matte-charcoal-windbreaker-jacket	Matte Charcoal Windbreaker Jacket	Jackets	209d5bab-ec1d-48d8-90f4-874c2b90c35a	Charcoal Grey	2799	4499	NEW	["https://images.unsplash.com/photo-1544441893-675973e31985?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop&q=80"]	[{"size": "S", "stock": 12, "isSoldOut": false}, {"size": "M", "stock": 24, "isSoldOut": false}, {"size": "L", "stock": 18, "isSoldOut": false}, {"size": "XL", "stock": 10, "isSoldOut": false}, {"size": "XXL", "stock": 6, "isSoldOut": false}]	[{"hex": "#333333", "name": "Charcoal Grey"}, {"hex": "#111111", "name": "Plain Black"}]	f	f	t	In Stock	Lightweight technical microfiber (wind and light drizzle resistant).	Machine wash cold 30°C.	Ultra-lightweight minimalist windbreaker jacket with concealed hood and bungee hem.	2026-10-06 15:48:23.892	2026-10-06 15:48:23.892	50
88faf289-529d-4989-a229-22737709b5a3	pleated-plain-black-trousers	Pleated Plain Black Trousers	Tailoring	514b828b-77da-4f6b-af12-7e41968dddd6	Plain Black	2499	3999	BESTSELLER	["https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=800&auto=format&fit=crop&q=80"]	[{"size": "S", "stock": 12, "isSoldOut": false}, {"size": "M", "stock": 24, "isSoldOut": false}, {"size": "L", "stock": 18, "isSoldOut": false}, {"size": "XL", "stock": 10, "isSoldOut": false}, {"size": "XXL", "stock": 6, "isSoldOut": false}]	[{"hex": "#111111", "name": "Plain Black"}, {"hex": "#708090", "name": "Slate Grey"}]	t	f	t	In Stock	Poly-Viscose Twill with 3% Elastane stretch.	Dry clean or cold delicate wash.	Relaxed wide-leg trousers with clean double front pleats and draped silhouette.	2026-10-06 15:48:23.894	2026-10-06 15:48:23.894	50
f29c19c0-1709-4108-bed8-858a01910030	clean-slate-grey-relaxed-chino	Clean Slate Grey Relaxed Chino	Tailoring	514b828b-77da-4f6b-af12-7e41968dddd6	Slate Grey	1999	3299	ESSENTIAL	["https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&auto=format&fit=crop&q=80"]	[{"size": "S", "stock": 12, "isSoldOut": false}, {"size": "M", "stock": 24, "isSoldOut": false}, {"size": "L", "stock": 18, "isSoldOut": false}, {"size": "XL", "stock": 10, "isSoldOut": false}, {"size": "XXL", "stock": 6, "isSoldOut": false}]	[{"hex": "#708090", "name": "Slate Grey"}, {"hex": "#111111", "name": "Plain Black"}]	f	f	t	In Stock	98% Cotton, 2% Spandex stretch twill.	Machine wash 40°C.	Everyday modern chino with tailored leg taper and clean welt back pockets.	2026-10-06 15:48:23.895	2026-10-06 15:48:23.895	50
008be438-e9c6-4d8e-96ee-8f30db0c5fdb	minimalist-matte-black-leather-belt	Minimalist Matte Black Leather Belt	Accessories	a3e6e835-c411-4de2-92ca-3f56d8b00d95	Plain Black	1299	1999	CORE	["https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=800&auto=format&fit=crop&q=80"]	[{"size": "Standard", "stock": 50, "isSoldOut": false}]	[{"hex": "#111111", "name": "Plain Black"}]	t	f	t	In Stock	100% Full-Grain Vegetable Tanned Leather with gunmetal brushed pin buckle.	Wipe with dry cloth.	30mm clean minimalist leather belt with bevelled edges and unbranded buckle.	2026-10-06 15:48:23.91	2026-10-06 15:48:23.91	50
1538effa-adcc-43c5-8eaf-0d7c37a6f779	premium-black-ribbed-cotton-socks-3-pack	Premium Black Ribbed Cotton Socks (3-Pack)	Accessories	a3e6e835-c411-4de2-92ca-3f56d8b00d95	Plain Black	599	999	PACK OF 3	["https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&auto=format&fit=crop&q=80"]	[{"size": "Standard", "stock": 50, "isSoldOut": false}]	[{"hex": "#111111", "name": "Plain Black"}]	f	f	t	In Stock	80% Combed Cotton, 17% Polyamide, 3% Elastane.	Machine wash 40°C.	Three pairs of cushioned ribbed everyday socks in solid jet black.	2026-10-06 15:48:23.912	2026-10-06 15:48:23.912	50
4ad0637a-def2-4e78-aed1-0b6af1303d04	classic-deep-navy-slim-fit-blazer	Classic Deep Navy Slim Fit Blazer	Formals	31dc345a-c6bb-4b51-9b24-fbd6278f47ea	Deep Navy	4599	7299	CORE	["https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&auto=format&fit=crop&q=80"]	[{"size": "S", "stock": 12, "isSoldOut": false}, {"size": "M", "stock": 24, "isSoldOut": false}, {"size": "L", "stock": 18, "isSoldOut": false}, {"size": "XL", "stock": 10, "isSoldOut": false}, {"size": "XXL", "stock": 6, "isSoldOut": false}]	[{"hex": "#1A2040", "name": "Deep Navy"}]	f	f	t	In Stock	Italian spun stretch wool-poly blend.	Dry clean.	Versatile navy blazer with contemporary half-canvas chest construction.	2026-10-06 15:48:23.916	2026-10-06 15:48:23.916	50
0ab11c02-1497-4194-a0b6-5bf111e1af34	formal-crisp-white-french-cuff-dress-shirt	Formal Crisp White French Cuff Dress Shirt	Formals	31dc345a-c6bb-4b51-9b24-fbd6278f47ea	Crisp White	2199	3499	PREMIUM	["https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80"]	[{"size": "S", "stock": 12, "isSoldOut": false}, {"size": "M", "stock": 24, "isSoldOut": false}, {"size": "L", "stock": 18, "isSoldOut": false}, {"size": "XL", "stock": 10, "isSoldOut": false}, {"size": "XXL", "stock": 6, "isSoldOut": false}]	[{"hex": "#FFFFFF", "name": "Crisp White"}]	t	f	t	In Stock	100% 2-Ply Egyptian Giza Cotton (120/2 yarn count).	Machine wash 40°C. Hot iron with steam.	Luxury white formal dress shirt with stiffened spread collar and double French cuffs.	2026-10-06 15:48:23.916	2026-10-06 15:48:23.916	50
\.


--
-- Data for Name: site_configs; Type: TABLE DATA; Schema: public; Owner: saadhan
--

COPY public.site_configs (id, "marqueeText", "archiveText", "heroHeadline", "heroSubheadline", "heroImage", "heroDropTag", "showWinterDrop", "winterDropTitle", "winterDropSubtitle", "winterDropCta", "winterDropImage", "createdAt", "updatedAt") FROM stdin;
8dea67b7-b856-49e7-a9c2-7ccc3dc6799c	COMPLIMENTARY EXPRESS WORLDWIDE SHIPPING ON ALL ORDERS OVER ₹5,000 — 100% HANDCRAFTED ATELIER TAILORING	\N	ATELIER PRECISION. TIMELESS SILHOUETTES.	Handcrafted menswear engineered for contemporary elegance and effortless structure.	\N	WINTER CAPSULE 2026	t	WINTER DROP 01	Limited capsule — Structured outerwear, heavyweight knitwear & tech bombers. Only 100 units per style.	Explore Winter Capsule	\N	2026-10-05 15:44:34.473	2026-10-05 15:44:34.473
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: saadhan
--

COPY public.users (id, name, email, password, role, "mfaSecret", "mfaEnabled", "backupCodes", "failedLoginAttempts", "lockedUntil", "createdById", "createdAt", "updatedAt", "lastLoginAt", "tempPassword") FROM stdin;
5ae2a2f1-0f7a-40a1-891a-7125177f3d1f	Penguin Lead Superadmin	admin@penguin.com	$2b$10$H4qhckhCOkpt5Ew3dS8eVeTpFolG519yBBNnbvmevy0mrxRuYWhD2	superadmin	KFDFWS3VKEVEUOLBLNJWYZ2YEMVFMKRE	t	["$2b$10$homY7fuIZwJPk20pTfti3eeeMdO0JrpugGiMA9iQlgnm78Zr6KpjS", "$2b$10$5GX2BAp1VkILKvcauOtjXeImbbxYu/jyLmjtCqEjCdOSaMgSzvpHO", "$2b$10$zfi8vCudZ/xHVSWmiUC4Nu7LqDRq0D6HFaJ5LjGh16lnRmGEymoHu", "$2b$10$qgbu0AMSeCZV03qxO0vbkOSzqyt5mTUBY1wQkiyQ5eRtSIHPIu10u", "$2b$10$ewwIY.2yTe3gJoWp392wRevt.9vqoze8uyU7K9QZBwp0IAnBa4wF2", "$2b$10$jgL/9PsgA/K41QNqMsDFMOuacdDzRIpgcw8A06FVgZlomeRhn0D0S", "$2b$10$pa8ITTgocFsgU3I576fN/OFV03Giir3tGXVcId6qk8Sb.eTYZJ9X.", "$2b$10$HbddOl8AJ8ztL3oZY.WMA.fOcndX.wDQtgw4.JcrOiA08zSr0b6g."]	0	\N	\N	2026-10-05 15:44:34.412	2026-10-08 18:47:24.05	2026-10-08 18:47:24.049	f
4eabe274-d6e2-4dd8-8b1d-cdc06816b6a5	Pavan	storeadmin@gmail.com	$2b$12$l2oiMebJ0KEJg/umEOZZkOsXTuAQMk3UR59HE1pCtd0bYKuuPwfMC	admin	\N	f	\N	0	\N	\N	2026-10-08 18:48:26.14	2026-10-08 18:48:26.14	\N	t
\.


--
-- Data for Name: wishlist_items; Type: TABLE DATA; Schema: public; Owner: saadhan
--

COPY public.wishlist_items (id, "customerId", "productId", "createdAt") FROM stdin;
\.


--
-- Name: addresses addresses_pkey; Type: CONSTRAINT; Schema: public; Owner: saadhan
--

ALTER TABLE ONLY public.addresses
    ADD CONSTRAINT addresses_pkey PRIMARY KEY (id);


--
-- Name: cart_items cart_items_pkey; Type: CONSTRAINT; Schema: public; Owner: saadhan
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_pkey PRIMARY KEY (id);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: saadhan
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: customers customers_pkey; Type: CONSTRAINT; Schema: public; Owner: saadhan
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_pkey PRIMARY KEY (id);


--
-- Name: order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: saadhan
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: saadhan
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: saadhan
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: site_configs site_configs_pkey; Type: CONSTRAINT; Schema: public; Owner: saadhan
--

ALTER TABLE ONLY public.site_configs
    ADD CONSTRAINT site_configs_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: saadhan
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: wishlist_items wishlist_items_pkey; Type: CONSTRAINT; Schema: public; Owner: saadhan
--

ALTER TABLE ONLY public.wishlist_items
    ADD CONSTRAINT wishlist_items_pkey PRIMARY KEY (id);


--
-- Name: cart_items_customerId_productId_size_color_key; Type: INDEX; Schema: public; Owner: saadhan
--

CREATE UNIQUE INDEX "cart_items_customerId_productId_size_color_key" ON public.cart_items USING btree ("customerId", "productId", size, color);


--
-- Name: categories_name_key; Type: INDEX; Schema: public; Owner: saadhan
--

CREATE UNIQUE INDEX categories_name_key ON public.categories USING btree (name);


--
-- Name: categories_slug_key; Type: INDEX; Schema: public; Owner: saadhan
--

CREATE UNIQUE INDEX categories_slug_key ON public.categories USING btree (slug);


--
-- Name: customers_email_key; Type: INDEX; Schema: public; Owner: saadhan
--

CREATE UNIQUE INDEX customers_email_key ON public.customers USING btree (email);


--
-- Name: customers_phone_key; Type: INDEX; Schema: public; Owner: saadhan
--

CREATE UNIQUE INDEX customers_phone_key ON public.customers USING btree (phone);


--
-- Name: orders_merchantTxnId_key; Type: INDEX; Schema: public; Owner: saadhan
--

CREATE UNIQUE INDEX "orders_merchantTxnId_key" ON public.orders USING btree ("merchantTxnId");


--
-- Name: orders_orderNumber_key; Type: INDEX; Schema: public; Owner: saadhan
--

CREATE UNIQUE INDEX "orders_orderNumber_key" ON public.orders USING btree ("orderNumber");


--
-- Name: products_slug_key; Type: INDEX; Schema: public; Owner: saadhan
--

CREATE UNIQUE INDEX products_slug_key ON public.products USING btree (slug);


--
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: saadhan
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);


--
-- Name: wishlist_items_customerId_productId_key; Type: INDEX; Schema: public; Owner: saadhan
--

CREATE UNIQUE INDEX "wishlist_items_customerId_productId_key" ON public.wishlist_items USING btree ("customerId", "productId");


--
-- Name: addresses addresses_customerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: saadhan
--

ALTER TABLE ONLY public.addresses
    ADD CONSTRAINT "addresses_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES public.customers(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: cart_items cart_items_customerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: saadhan
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT "cart_items_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES public.customers(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: order_items order_items_orderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: saadhan
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT "order_items_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES public.orders(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: orders orders_customerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: saadhan
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT "orders_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES public.customers(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: products products_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: saadhan
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT "products_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public.categories(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: wishlist_items wishlist_items_customerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: saadhan
--

ALTER TABLE ONLY public.wishlist_items
    ADD CONSTRAINT "wishlist_items_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES public.customers(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict m3Wra6i0xf86Oi4X8Bbg3ZZQ4ZUtfvTUErtXsck9jClq6AXt0KniARbublDPwTz

