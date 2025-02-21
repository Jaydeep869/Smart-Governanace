--
-- PostgreSQL database dump
--

-- Dumped from database version 16.6 (Ubuntu 16.6-0ubuntu0.24.04.1)
-- Dumped by pg_dump version 16.6 (Ubuntu 16.6-0ubuntu0.24.04.1)

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

--
-- Name: set_end_date(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.set_end_date() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF NEW.status = 'Completed' AND NEW.end_date IS NULL THEN
        NEW.end_date = CURRENT_DATE;
    ELSIF NEW.status != 'Completed' THEN
        NEW.end_date = NULL;
    END IF;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.set_end_date() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: feedback; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.feedback (
    id integer NOT NULL,
    user_name character varying(50),
    email character varying(50),
    message text,
    status character varying(20) DEFAULT 'Received'::character varying,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.feedback OWNER TO postgres;

--
-- Name: feedback_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.feedback_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.feedback_id_seq OWNER TO postgres;

--
-- Name: feedback_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.feedback_id_seq OWNED BY public.feedback.id;


--
-- Name: funds; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.funds (
    id integer NOT NULL,
    district character varying(100) NOT NULL,
    sector character varying(100) NOT NULL,
    fund_type character varying(100) NOT NULL,
    amount numeric NOT NULL
);


ALTER TABLE public.funds OWNER TO postgres;

--
-- Name: funds_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.funds_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.funds_id_seq OWNER TO postgres;

--
-- Name: funds_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.funds_id_seq OWNED BY public.funds.id;


--
-- Name: municipal_elections; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.municipal_elections (
    id integer NOT NULL,
    candidate_name character varying(255) NOT NULL,
    candidate_party character varying(255) NOT NULL,
    age integer,
    party_join_date date,
    election_date date,
    municipality character varying(255),
    ward character varying(255),
    status character varying(20) NOT NULL,
    votes_received integer,
    result character varying(50),
    margin_of_votes integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT municipal_elections_age_check CHECK ((age > 0)),
    CONSTRAINT municipal_elections_status_check CHECK (((status)::text = ANY ((ARRAY['upcoming'::character varying, 'completed'::character varying])::text[])))
);


ALTER TABLE public.municipal_elections OWNER TO postgres;

--
-- Name: municipal_elections_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.municipal_elections_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.municipal_elections_id_seq OWNER TO postgres;

--
-- Name: municipal_elections_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.municipal_elections_id_seq OWNED BY public.municipal_elections.id;


--
-- Name: national_parliamentary_elections; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.national_parliamentary_elections (
    id integer NOT NULL,
    candidate_name character varying(255) NOT NULL,
    candidate_party character varying(255) NOT NULL,
    age integer,
    party_join_date date,
    election_date date,
    constituency character varying(255),
    status character varying(20) NOT NULL,
    votes_received integer,
    result character varying(50),
    margin_of_votes integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT national_parliamentary_elections_age_check CHECK ((age > 0)),
    CONSTRAINT national_parliamentary_elections_status_check CHECK (((status)::text = ANY ((ARRAY['upcoming'::character varying, 'completed'::character varying])::text[])))
);


ALTER TABLE public.national_parliamentary_elections OWNER TO postgres;

--
-- Name: national_parliamentary_elections_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.national_parliamentary_elections_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.national_parliamentary_elections_id_seq OWNER TO postgres;

--
-- Name: national_parliamentary_elections_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.national_parliamentary_elections_id_seq OWNED BY public.national_parliamentary_elections.id;


--
-- Name: panchayat_elections; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.panchayat_elections (
    id integer NOT NULL,
    candidate_name character varying(255) NOT NULL,
    candidate_party character varying(255) NOT NULL,
    age integer,
    party_join_date date,
    election_date date,
    panchayat_name character varying(255),
    village character varying(255),
    status character varying(20) NOT NULL,
    votes_received integer,
    result character varying(50),
    margin_of_votes integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT panchayat_elections_age_check CHECK ((age > 0)),
    CONSTRAINT panchayat_elections_status_check CHECK (((status)::text = ANY ((ARRAY['upcoming'::character varying, 'completed'::character varying])::text[])))
);


ALTER TABLE public.panchayat_elections OWNER TO postgres;

--
-- Name: panchayat_elections_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.panchayat_elections_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.panchayat_elections_id_seq OWNER TO postgres;

--
-- Name: panchayat_elections_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.panchayat_elections_id_seq OWNED BY public.panchayat_elections.id;


--
-- Name: projects; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.projects (
    serialno integer NOT NULL,
    project_name character varying(255) NOT NULL,
    description text,
    status character varying(50),
    budget numeric(15,2),
    percent_completed numeric(5,2),
    project_type character varying(100),
    start_date date NOT NULL,
    end_date date,
    CONSTRAINT projects_percent_completed_check CHECK (((percent_completed >= (0)::numeric) AND (percent_completed <= (100)::numeric))),
    CONSTRAINT projects_status_check CHECK (((status)::text = ANY ((ARRAY['Completed'::character varying, 'In Progress'::character varying, 'Not Started'::character varying])::text[])))
);


ALTER TABLE public.projects OWNER TO postgres;

--
-- Name: projects_serialno_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.projects_serialno_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.projects_serialno_seq OWNER TO postgres;

--
-- Name: projects_serialno_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.projects_serialno_seq OWNED BY public.projects.serialno;


--
-- Name: state_legislative_elections; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.state_legislative_elections (
    id integer NOT NULL,
    candidate_name character varying(255) NOT NULL,
    candidate_party character varying(255) NOT NULL,
    age integer,
    party_join_date date,
    election_date date,
    assembly_constituency character varying(255),
    status character varying(20) NOT NULL,
    votes_received integer,
    result character varying(50),
    margin_of_votes integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT state_legislative_elections_age_check CHECK ((age > 0)),
    CONSTRAINT state_legislative_elections_status_check CHECK (((status)::text = ANY ((ARRAY['upcoming'::character varying, 'completed'::character varying])::text[])))
);


ALTER TABLE public.state_legislative_elections OWNER TO postgres;

--
-- Name: state_legislative_elections_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.state_legislative_elections_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.state_legislative_elections_id_seq OWNER TO postgres;

--
-- Name: state_legislative_elections_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.state_legislative_elections_id_seq OWNED BY public.state_legislative_elections.id;


--
-- Name: suggestions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.suggestions (
    serial integer NOT NULL,
    project_name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    suggestion text NOT NULL,
    date_given timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    status character varying(50) DEFAULT 'Pending'::character varying,
    category character varying(100)
);


ALTER TABLE public.suggestions OWNER TO postgres;

--
-- Name: suggestions_serial_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.suggestions_serial_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.suggestions_serial_seq OWNER TO postgres;

--
-- Name: suggestions_serial_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.suggestions_serial_seq OWNED BY public.suggestions.serial;


--
-- Name: feedback id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.feedback ALTER COLUMN id SET DEFAULT nextval('public.feedback_id_seq'::regclass);


--
-- Name: funds id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.funds ALTER COLUMN id SET DEFAULT nextval('public.funds_id_seq'::regclass);


--
-- Name: municipal_elections id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.municipal_elections ALTER COLUMN id SET DEFAULT nextval('public.municipal_elections_id_seq'::regclass);


--
-- Name: national_parliamentary_elections id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.national_parliamentary_elections ALTER COLUMN id SET DEFAULT nextval('public.national_parliamentary_elections_id_seq'::regclass);


--
-- Name: panchayat_elections id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.panchayat_elections ALTER COLUMN id SET DEFAULT nextval('public.panchayat_elections_id_seq'::regclass);


--
-- Name: projects serialno; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projects ALTER COLUMN serialno SET DEFAULT nextval('public.projects_serialno_seq'::regclass);


--
-- Name: state_legislative_elections id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.state_legislative_elections ALTER COLUMN id SET DEFAULT nextval('public.state_legislative_elections_id_seq'::regclass);


--
-- Name: suggestions serial; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.suggestions ALTER COLUMN serial SET DEFAULT nextval('public.suggestions_serial_seq'::regclass);


--
-- Data for Name: feedback; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.feedback (id, user_name, email, message, status, created_at) FROM stdin;
1	Jaydeep	jaydeeppokhariya2106@gmail.com	hy how are you	Received	2025-02-17 17:43:48.72887
2	Divyanshu	divyanshupassi@gmail.com	hy buddy it is good	Received	2025-02-17 23:03:22.790248
3	Jaydeep	jaydeeppokhariya2106@gmail.com	this is looking good\n	Received	2025-02-17 23:58:00.781579
4	harsh	h@gmail.com	it is a big issue	Received	2025-02-20 13:34:16.258425
\.


--
-- Data for Name: funds; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.funds (id, district, sector, fund_type, amount) FROM stdin;
1	Varanasi	Education	Central Grant	500000
2	Varanasi	Health	State Subsidy	300000
3	Varanasi	Infrastructure	Local Fund	750000
4	Varanasi	Agriculture	Special Scheme	200000
\.


--
-- Data for Name: municipal_elections; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.municipal_elections (id, candidate_name, candidate_party, age, party_join_date, election_date, municipality, ward, status, votes_received, result, margin_of_votes, created_at, updated_at) FROM stdin;
1	Manoj Tiwari	BJP	65	1995-03-10	2018-12-05	Varanasi Municipal Corporation	Ward 3	upcoming	\N	\N	\N	2025-02-19 10:16:12.500978	2025-02-19 10:16:12.500978
2	Sushma Singh	INC	47	2008-09-25	2025-02-20	Varanasi Municipal Corporation	Ward 7	upcoming	\N	\N	\N	2025-02-19 10:16:12.504649	2025-02-19 10:16:12.504649
3	Arun Sharma	AAP	54	2007-07-07	2025-06-30	Varanasi Municipal Corporation	Ward 10	upcoming	\N	\N	\N	2025-02-19 10:16:12.505811	2025-02-19 10:16:12.505811
\.


--
-- Data for Name: national_parliamentary_elections; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.national_parliamentary_elections (id, candidate_name, candidate_party, age, party_join_date, election_date, constituency, status, votes_received, result, margin_of_votes, created_at, updated_at) FROM stdin;
3	Narendra Modi	BJP	76	2005-05-20	2019-05-23	Varanasi	completed	150000	Won	10000	2025-02-19 10:41:41.393714	2025-02-19 10:41:41.393714
4	Rahul Gandhi	INC	58	2010-08-15	2019-05-23	Varanasi	completed	140000	Lost	-10000	2025-02-19 10:41:41.393714	2025-02-19 10:41:41.393714
5	Arvind Kejriwal	AAP	53	2008-09-10	2019-05-23	Varanasi	completed	130000	Lost	-20000	2025-02-19 10:41:41.393714	2025-02-19 10:41:41.393714
\.


--
-- Data for Name: panchayat_elections; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.panchayat_elections (id, candidate_name, candidate_party, age, party_join_date, election_date, panchayat_name, village, status, votes_received, result, margin_of_votes, created_at, updated_at) FROM stdin;
1	Ram Prasad	BJP	48	2000-05-10	2016-03-18	Varanasi Panchayat	Village X	upcoming	\N	\N	\N	2025-02-19 10:18:18.48796	2025-02-19 10:18:18.48796
2	Shyam Lal	INC	52	1998-11-05	2024-08-10	Varanasi Panchayat	Village Y	upcoming	\N	\N	\N	2025-02-19 10:18:18.490866	2025-02-19 10:18:18.490866
3	Sita Ram	AAP	50	2005-05-05	2024-12-15	Varanasi Panchayat	Village Z	upcoming	\N	\N	\N	2025-02-19 10:18:18.492095	2025-02-19 10:18:18.492095
\.


--
-- Data for Name: projects; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.projects (serialno, project_name, description, status, budget, percent_completed, project_type, start_date, end_date) FROM stdin;
1	Smart City Initiative	Building smart infrastructure	In Progress	5000000.00	100.00	Infrastructure	2024-01-01	\N
2	Varanasi Ropeway Project	Urban ropeway from Cantonment to RathYatra to ease traffic congestion.	In Progress	750000000.00	65.00	Infrastructure	2024-02-01	\N
3	RJ Sankara Eye Hospital	New hospital for eye care serving 20 districts, managed by Kanchi Math.	Completed	150000000.00	100.00	Healthcare	2023-05-15	2024-10-10
4	Sarnath Tourism Development	Tourism infrastructure improvements and heritage preservation.	Not Started	60000000.00	0.00	Tourism	2025-01-10	\N
5	Varanasi Master Plan 2031	Urban plan covering roads, warehouses, and ghat redevelopment.	In Progress	1200000000.00	30.00	Urban Development	2024-01-15	\N
\.


--
-- Data for Name: state_legislative_elections; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.state_legislative_elections (id, candidate_name, candidate_party, age, party_join_date, election_date, assembly_constituency, status, votes_received, result, margin_of_votes, created_at, updated_at) FROM stdin;
4	Keshav Prasad Maurya	BJP	55	2002-01-15	2018-02-20	Varanasi Assembly	completed	95000	Won	10000	2025-02-19 10:41:55.771019	2025-02-19 10:41:55.771019
5	Akhilesh Yadav	SP	60	1989-06-01	2018-02-20	Varanasi Assembly	completed	85000	Lost	-10000	2025-02-19 10:41:55.771019	2025-02-19 10:41:55.771019
6	Aruna Singh	INC	50	1999-03-10	2018-02-20	Varanasi Assembly	completed	75000	Lost	-20000	2025-02-19 10:41:55.771019	2025-02-19 10:41:55.771019
\.


--
-- Data for Name: suggestions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.suggestions (serial, project_name, email, suggestion, date_given, status, category) FROM stdin;
1	master ghats	jaydeeppokhariya2106@gmail.com	we can master ghats by connecting them and reducing crowds at ghats	2025-02-18 20:43:43.3618	Pending	\N
2	master ghatsccc	h@gmail.com	it is a good issue	2025-02-20 14:53:16.300204	Pending	\N
3	mr ghats	jayeshkpuri@gmail.com	it can be a good ghat 	2025-02-20 14:54:12.024766	Pending	\N
4	master ghats	jaydeeppokhariya2106@gmail.com	gfdgfdh	2025-02-21 14:14:19.60083	Pending	\N
\.


--
-- Name: feedback_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.feedback_id_seq', 4, true);


--
-- Name: funds_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.funds_id_seq', 4, true);


--
-- Name: municipal_elections_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.municipal_elections_id_seq', 3, true);


--
-- Name: national_parliamentary_elections_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.national_parliamentary_elections_id_seq', 5, true);


--
-- Name: panchayat_elections_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.panchayat_elections_id_seq', 3, true);


--
-- Name: projects_serialno_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.projects_serialno_seq', 5, true);


--
-- Name: state_legislative_elections_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.state_legislative_elections_id_seq', 6, true);


--
-- Name: suggestions_serial_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.suggestions_serial_seq', 4, true);


--
-- Name: feedback feedback_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.feedback
    ADD CONSTRAINT feedback_pkey PRIMARY KEY (id);


--
-- Name: funds funds_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.funds
    ADD CONSTRAINT funds_pkey PRIMARY KEY (id);


--
-- Name: municipal_elections municipal_elections_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.municipal_elections
    ADD CONSTRAINT municipal_elections_pkey PRIMARY KEY (id);


--
-- Name: national_parliamentary_elections national_parliamentary_elections_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.national_parliamentary_elections
    ADD CONSTRAINT national_parliamentary_elections_pkey PRIMARY KEY (id);


--
-- Name: panchayat_elections panchayat_elections_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.panchayat_elections
    ADD CONSTRAINT panchayat_elections_pkey PRIMARY KEY (id);


--
-- Name: projects projects_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_pkey PRIMARY KEY (serialno);


--
-- Name: state_legislative_elections state_legislative_elections_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.state_legislative_elections
    ADD CONSTRAINT state_legislative_elections_pkey PRIMARY KEY (id);


--
-- Name: suggestions suggestions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.suggestions
    ADD CONSTRAINT suggestions_pkey PRIMARY KEY (serial);


--
-- Name: projects trigger_set_end_date; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_set_end_date BEFORE INSERT OR UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.set_end_date();


--
-- PostgreSQL database dump complete
--

