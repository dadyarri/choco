--
-- PostgreSQL database dump
--

-- Dumped from database version 13.3
-- Dumped by pg_dump version 13.3

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
-- Name: aerich; Type: TABLE; Schema: public; Owner: dadyarri
--

CREATE TABLE public.aerich (
    id integer NOT NULL,
    version character varying(255) NOT NULL,
    app character varying(20) NOT NULL,
    content jsonb NOT NULL
);


ALTER TABLE public.aerich OWNER TO dadyarri;

--
-- Name: aerich_id_seq; Type: SEQUENCE; Schema: public; Owner: dadyarri
--

CREATE SEQUENCE public.aerich_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.aerich_id_seq OWNER TO dadyarri;

--
-- Name: aerich_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dadyarri
--

ALTER SEQUENCE public.aerich_id_seq OWNED BY public.aerich.id;


--
-- Name: good; Type: TABLE; Schema: public; Owner: dadyarri
--

CREATE TABLE public.good (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    wholesale_price integer NOT NULL,
    retail_price integer NOT NULL,
    leftover integer NOT NULL
);


ALTER TABLE public.good OWNER TO dadyarri;

--
-- Name: good_id_seq; Type: SEQUENCE; Schema: public; Owner: dadyarri
--

CREATE SEQUENCE public.good_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.good_id_seq OWNER TO dadyarri;

--
-- Name: good_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dadyarri
--

ALTER SEQUENCE public.good_id_seq OWNED BY public.good.id;


--
-- Name: aerich id; Type: DEFAULT; Schema: public; Owner: dadyarri
--

ALTER TABLE ONLY public.aerich ALTER COLUMN id SET DEFAULT nextval('public.aerich_id_seq'::regclass);


--
-- Name: good id; Type: DEFAULT; Schema: public; Owner: dadyarri
--

ALTER TABLE ONLY public.good ALTER COLUMN id SET DEFAULT nextval('public.good_id_seq'::regclass);


--
-- Name: aerich aerich_pkey; Type: CONSTRAINT; Schema: public; Owner: dadyarri
--

ALTER TABLE ONLY public.aerich
    ADD CONSTRAINT aerich_pkey PRIMARY KEY (id);


--
-- Name: good good_pkey; Type: CONSTRAINT; Schema: public; Owner: dadyarri
--

ALTER TABLE ONLY public.good
    ADD CONSTRAINT good_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

