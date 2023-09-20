--
-- PostgreSQL database dump
--

-- Dumped from database version 15.4
-- Dumped by pg_dump version 15.4

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: alembic_version; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.alembic_version (
    version_num character varying(32) NOT NULL
);


ALTER TABLE public.alembic_version OWNER TO postgres;

--
-- Name: order_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_items (
    id integer NOT NULL,
    order_id integer NOT NULL,
    restaurant_item_id integer NOT NULL,
    quantity integer NOT NULL,
    price_at_time_of_order double precision NOT NULL
);


ALTER TABLE public.order_items OWNER TO postgres;

--
-- Name: order_items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.order_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.order_items_id_seq OWNER TO postgres;

--
-- Name: order_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.order_items_id_seq OWNED BY public.order_items.id;


--
-- Name: orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orders (
    order_id integer NOT NULL,
    user_id integer NOT NULL,
    restaurant_id integer NOT NULL,
    total_amount double precision NOT NULL,
    status character varying NOT NULL,
    delivery_address character varying NOT NULL,
    time_placed timestamp without time zone
);


ALTER TABLE public.orders OWNER TO postgres;

--
-- Name: orders_order_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.orders_order_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.orders_order_id_seq OWNER TO postgres;

--
-- Name: orders_order_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.orders_order_id_seq OWNED BY public.orders.order_id;


--
-- Name: payments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payments (
    transaction_id integer NOT NULL,
    user_id integer NOT NULL,
    order_id integer,
    amount double precision NOT NULL,
    status character varying NOT NULL,
    transaction_time timestamp without time zone
);


ALTER TABLE public.payments OWNER TO postgres;

--
-- Name: payments_transaction_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.payments_transaction_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.payments_transaction_id_seq OWNER TO postgres;

--
-- Name: payments_transaction_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.payments_transaction_id_seq OWNED BY public.payments.transaction_id;


--
-- Name: restaurant_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.restaurant_items (
    id integer NOT NULL,
    name character varying(150),
    description character varying(300),
    price double precision,
    restaurant_id integer
);


ALTER TABLE public.restaurant_items OWNER TO postgres;

--
-- Name: restaurant_items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.restaurant_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.restaurant_items_id_seq OWNER TO postgres;

--
-- Name: restaurant_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.restaurant_items_id_seq OWNED BY public.restaurant_items.id;


--
-- Name: restaurants; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.restaurants (
    id integer NOT NULL,
    name character varying(150),
    address character varying(300)
);


ALTER TABLE public.restaurants OWNER TO postgres;

--
-- Name: restaurants_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.restaurants_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.restaurants_id_seq OWNER TO postgres;

--
-- Name: restaurants_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.restaurants_id_seq OWNED BY public.restaurants.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(150),
    email character varying(150),
    password character varying(200),
    address character varying(300),
    phone_number character varying(20),
    scopes character varying
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: order_items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items ALTER COLUMN id SET DEFAULT nextval('public.order_items_id_seq'::regclass);


--
-- Name: orders order_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders ALTER COLUMN order_id SET DEFAULT nextval('public.orders_order_id_seq'::regclass);


--
-- Name: payments transaction_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments ALTER COLUMN transaction_id SET DEFAULT nextval('public.payments_transaction_id_seq'::regclass);


--
-- Name: restaurant_items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.restaurant_items ALTER COLUMN id SET DEFAULT nextval('public.restaurant_items_id_seq'::regclass);


--
-- Name: restaurants id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.restaurants ALTER COLUMN id SET DEFAULT nextval('public.restaurants_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: alembic_version; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.alembic_version (version_num) FROM stdin;
3ffec3731843
\.


--
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_items (id, order_id, restaurant_item_id, quantity, price_at_time_of_order) FROM stdin;
6	4	1	3	2.99
7	4	2	2	4.99
8	4	3	6	3.99
9	4	8	1	14.5
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.orders (order_id, user_id, restaurant_id, total_amount, status, delivery_address, time_placed) FROM stdin;
4	22	1	57.39	In Progress	66 Dalmally Road	2023-09-19 23:35:00.126064
\.


--
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payments (transaction_id, user_id, order_id, amount, status, transaction_time) FROM stdin;
\.


--
-- Data for Name: restaurant_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.restaurant_items (id, name, description, price, restaurant_id) FROM stdin;
1	Mild Chicken Wings	Chicken wings without flavour	2.99	1
2	Spicy Chicken Wings	Spicy wings without flavour	4.99	1
4	Mixed Grill	Everything you would ever need	15.99	2
5	Shish Kebab	Lamb with bread	7.99	2
3	Chips	Delectable Chicken Wrap	3.99	1
6	Chicken Shawarma	Chicken Wrap	9.99	2
7	Truffalo Burger	Buttermilk Fried Thigh, Wingmans Truffalo Sauce, Black Pepper & Truffle Mayo, Grated Cheese, MSG Pickles, Sesame Brioche Bun + Choice of Fries	16.5	3
8	BBQ Classic	Crispy Buttermilk Fried Chicken Thigh Covered In Sweet & Smokey BBQ Sauce, American Cheese, Shredded Iceberg, MSG Pickles, House Ranch, Sesame Brioche Bun + Choice of Fries	14.5	3
9	Truffle Parm Fries (GF)	Truffle Butter & Parmesan Fries	6.5	3
10	Pizza Antonio	Less tomato and after baking, rocket, fresh buffalo mozzarella, cherry tomatoes and parmesan. Stone-baked using our very own sourdough starter for a great thin pizza base. We use top quality fresh ingredients to ensure all handcrafted, made to order pizza is the best they could possible be.	16.5	4
11	Fantasia di Funghi Pizza	Wild mushrooms, ricotta, mozzarella fior di latte and truffle oil. Stone-baked using our very own sourdough starter for a great thin pizza base. We use top quality fresh ingredients to ensure all handcrafted, made to order pizza is the best they could possible be.	16.5	4
12	Cold Coffee	Espresso, ice, condensed milk and whole milk.	6.29	4
15	Katsu Curry	Our house curry sauce served on white rice, topped with deep-fried chicken cutlets. Garnished with Japanese pickles. Allergen Information Contains: Gluten, Soy, Milk, Celery, Sesame, Sulphides, Molluscs	14.5	5
16	Dracula Tonkotsu	Rich and aromatic, this tonkotsu adds extra black garlic oil and garlic chips. Allergen Information Contains: Gluten, Eggs, Fish, Soy, Sulphides	14.9	5
13	Kotteri Hakata Tonkotsu	A meatier version of our classic tonkotsu ramen with extra nitamago egg. Allergen Information Contains: Gluten, Eggs, Fish, Soy, Sulphides	15.4	5
17	Iced Latte	Espresso, ice, milk. Amazing!	6.69	6
18	Cappuccino	Espresso with steamed milk and micro foam.	5.89	6
19	Matcha Latte	100% pure, natural matcha green tea powder and latte milk.	5.89	6
20	Hot Chocolate	100% pure, natural matcha green tea powder and latte milk.	5.89	6
21	Salmon Roll	6 x Salmon, spicy mayo and sesame seeds.	7.4	7
22	King Deluxe Roll Set	6 Salmon rolls,, 6 Unagi rolls, 6 Avocado Rolls, 2 Tuna Nigari.	23.2	7
23	Duck Gyoza	7 pcs deep fried duck gyoza served with soy base, chilli sauce and limes.	9.5	7
\.


--
-- Data for Name: restaurants; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.restaurants (id, name, address) FROM stdin;
2	Kebab Antalya	52 South Croydon Road
1	Korean Fried Chicken	55 Charing Cross Street
3	Billie's Burgers	67 Portland Road
4	La Bellissima Pizzeria	72 West Moorland Road
5	Kyoto Gardens	1 Marylebone Street
6	MM&M London	7 King Street
7	The Sushi Co	32 Manchester Road
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, username, email, password, address, phone_number, scopes) FROM stdin;
28	Sasha	sasha@gmail.com	$2b$12$NSk9jKdkOrNCH8ptzYFnIOXK.XT1EGztwLBpIl7gY6WHoGFyFuOI2	66 Dalmally Road	\N	read:profile
26	Michael	michael@gmail.com	$2b$12$tJ9TMuxZF07PcTi6XH8tn.HtHeuPtEOPromjhJoVBTEsXXwuF8Z7u	66 Dalmally Road	\N	read:profile
20	Ken	ken@gmail.com	$2b$12$IaAQ2K09ebEipxXu0cm/zuG0mjhbC4zW.QJHaDE5Yk57H8wF9/iO.	66 Dalmally Road	\N	read:profile
21	Iain	iain@gmail.com	$2b$12$0ITxc/QucwdLlwiCFBmvT.sCkES3i4XZdQdGvrOJjEue8oCk6raFO	66 Dalmally Road	\N	read:profile
22	Victoria	victoria@gmail.com	$2b$12$9aiWd67Z5TY3/zxneOXAFOVsJb03flWeds670ml.0MSBcto9x3sLe	66 Dalmally Road	\N	read:profile
24	Fred	fred@gmail.com	$2b$12$wXn.BTkigMTBQ5WKy6phzudS4/aSEwWP164UExPfzH3H4htZhSkZW	66 Dalmally Road	\N	read:profile
25	Adi	adi@gmail.com	$2b$12$la7d9haio3KI.RT/9.8g8ulNXliEPgXmRQEYWcbG56/slBI7xEWp2	66 Dalmally Road	\N	read:profile
23	Misha	misha@gmail.com	$2b$12$rbg8CL7AYK/b5wsRJKphbedCYHFTY59e4x9uziEmrcmGxJCES8hXi	66 Dalmally Road	\N	read:profile
\.


--
-- Name: order_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.order_items_id_seq', 9, true);


--
-- Name: orders_order_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.orders_order_id_seq', 4, true);


--
-- Name: payments_transaction_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.payments_transaction_id_seq', 1, false);


--
-- Name: restaurant_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.restaurant_items_id_seq', 23, true);


--
-- Name: restaurants_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.restaurants_id_seq', 7, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 28, true);


--
-- Name: alembic_version alembic_version_pkc; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alembic_version
    ADD CONSTRAINT alembic_version_pkc PRIMARY KEY (version_num);


--
-- Name: order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (order_id);


--
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (transaction_id);


--
-- Name: restaurant_items restaurant_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.restaurant_items
    ADD CONSTRAINT restaurant_items_pkey PRIMARY KEY (id);


--
-- Name: restaurants restaurants_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.restaurants
    ADD CONSTRAINT restaurants_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: ix_order_items_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_order_items_id ON public.order_items USING btree (id);


--
-- Name: ix_orders_order_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_orders_order_id ON public.orders USING btree (order_id);


--
-- Name: ix_payments_transaction_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_payments_transaction_id ON public.payments USING btree (transaction_id);


--
-- Name: ix_restaurant_items_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_restaurant_items_id ON public.restaurant_items USING btree (id);


--
-- Name: ix_restaurant_items_name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_restaurant_items_name ON public.restaurant_items USING btree (name);


--
-- Name: ix_restaurants_address; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_restaurants_address ON public.restaurants USING btree (address);


--
-- Name: ix_restaurants_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_restaurants_id ON public.restaurants USING btree (id);


--
-- Name: ix_restaurants_name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ix_restaurants_name ON public.restaurants USING btree (name);


--
-- Name: ix_users_address; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_users_address ON public.users USING btree (address);


--
-- Name: ix_users_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ix_users_email ON public.users USING btree (email);


--
-- Name: ix_users_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_users_id ON public.users USING btree (id);


--
-- Name: ix_users_phone_number; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ix_users_phone_number ON public.users USING btree (phone_number);


--
-- Name: ix_users_username; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ix_users_username ON public.users USING btree (username);


--
-- Name: order_items order_items_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(order_id);


--
-- Name: order_items order_items_restaurant_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_restaurant_item_id_fkey FOREIGN KEY (restaurant_item_id) REFERENCES public.restaurant_items(id);


--
-- Name: orders orders_restaurant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_restaurant_id_fkey FOREIGN KEY (restaurant_id) REFERENCES public.restaurants(id);


--
-- Name: orders orders_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: payments payments_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(order_id);


--
-- Name: payments payments_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: restaurant_items restaurant_items_restaurant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.restaurant_items
    ADD CONSTRAINT restaurant_items_restaurant_id_fkey FOREIGN KEY (restaurant_id) REFERENCES public.restaurants(id);


--
-- PostgreSQL database dump complete
--

