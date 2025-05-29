
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `api`
--

-- --------------------------------------------------------

--
-- Table structure for table `agents`
--

CREATE TABLE `agents` (
  `id` int(11) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(60) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `email` varchar(128) NOT NULL,
  `position` varchar(40) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `agents`
--

INSERT INTO `agents` (`id`, `first_name`, `last_name`, `phone`, `email`, `position`) VALUES
(1, 'Jan', 'Kowalski', '123456789', 'jan.kowalski@example.com', 'Agent'),
(2, 'Anna', 'Nowak', '987654321', 'anna.nowak@example.com', 'Agent'),
(3, 'Piotr', 'Wójcik', '555111222', 'piotr.wojcik@example.com', 'Agent'),
(4, 'Małgorzata', 'Kamińska', '999888777', 'malgorzata.kaminska@example.com', 'Agent'),
(5, 'Krzysztof', 'Lewandowski', '444333222', 'krzysztof.lewandowski@example.com', 'Agent'),
(6, 'Agnieszka', 'Zielińska', '111222333', 'agnieszka.zielinska@example.com', 'Agent'),
(7, 'Marcin', 'Szymański', '777888999', 'marcin.szymanski@example.com', 'Agent'),
(8, 'Joanna', 'Woźniak', '222333444', 'joanna.wozniak@example.com', 'Agent'),
(9, 'Adam', 'Dąbrowski', '666555444', 'adam.dabrowski@example.com', 'Agent'),
(10, 'Katarzyna', 'Jankowska', '888999111', 'katarzyna.jankowska@example.com', 'Agent'),
(11, 'Michał', 'Mazur', '555666777', 'michal.mazur@example.com', 'Agent'),
(12, 'Karolina', 'Kowalczyk', '222111333', 'karolina.kowalczyk@example.com', 'Agent'),
(13, 'Rafał', 'Grabowski', '777666555', 'rafal.grabowski@example.com', 'Agent'),
(14, 'Monika', 'Pawlak', '999111222', 'monika.pawlak@example.com', 'Agent'),
(15, 'Tomasz', 'Michalski', '444555666', 'tomasz.michalski@example.com', 'Agent'),
(16, 'Iwona', 'Olszewska', '888111999', 'iwona.olszewska@example.com', 'Agent'),
(17, 'Łukasz', 'Nowicki', '333222111', 'lukasz.nowicki@example.com', 'Agent'),
(18, 'Magdalena', 'Jabłońska', '111444555', 'magdalena.jablonska@example.com', 'Agent'),
(19, 'Kamil', 'Król', '666777888', 'kamil.krol@example.com', 'Agent'),
(20, 'Natalia', 'Wróbel', '555444333', 'natalia.wrobel@example.com', 'Agent');

-- --------------------------------------------------------

--
-- Table structure for table `clients`
--

CREATE TABLE `clients` (
  `id` int(11) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(60) NOT NULL,
  `phone` varchar(12) NOT NULL,
  `email` varchar(128) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `clients`
--

INSERT INTO `clients` (`id`, `first_name`, `last_name`, `phone`, `email`) VALUES
(1, 'Jan', 'Kowalski', '123456789', 'jan.kowalski@example.com'),
(2, 'Anna', 'Nowak', '987654321', 'anna.nowak@example.com'),
(3, 'Piotr', 'Wójcik', '555111222', 'piotr.wojcik@example.com'),
(4, 'Małgorzata', 'Kamińska', '999888777', 'malgorzata.kaminska@example.com'),
(5, 'Krzysztof', 'Lewandowski', '444333222', 'krzysztof.lewandowski@example.com'),
(6, 'Agnieszka', 'Zielińska', '111222333', 'agnieszka.zielinska@example.com'),
(7, 'Marcin', 'Szymański', '777888999', 'marcin.szymanski@example.com'),
(8, 'Joanna', 'Woźniak', '222333444', 'joanna.wozniak@example.com'),
(9, 'Adam', 'Dąbrowski', '666555444', 'adam.dabrowski@example.com'),
(10, 'Katarzyna', 'Jankowska', '888999111', 'katarzyna.jankowska@example.com'),
(11, 'Michał', 'Mazur', '555666777', 'michal.mazur@example.com'),
(12, 'Karolina', 'Kowalczyk', '222111333', 'karolina.kowalczyk@example.com'),
(13, 'Rafał', 'Grabowski', '777666555', 'rafal.grabowski@example.com'),
(14, 'Monika', 'Pawlak', '999111222', 'monika.pawlak@example.com'),
(15, 'Tomasz', 'Michalski', '444555666', 'tomasz.michalski@example.com'),
(16, 'Iwona', 'Olszewska', '888111999', 'iwona.olszewska@example.com'),
(17, 'Łukasz', 'Nowicki', '333222111', 'lukasz.nowicki@example.com'),
(18, 'Magdalena', 'Jabłońska', '111444555', 'magdalena.jablonska@example.com'),
(19, 'Kamil', 'Król', '666777888', 'kamil.krol@example.com'),
(20, 'Natalia', 'Wróbel', '555444333', 'natalia.wrobel@example.com'),
(21, 'Paweł', 'Wieczorek', '222333444', 'pawel.wieczorek@example.com'),
(22, 'Alicja', 'Stępień', '888555444', 'alicja.stepien@example.com'),
(23, 'Artur', 'Piasecki', '777111222', 'artur.piasecki@example.com'),
(24, 'Marzena', 'Sikora', '333444555', 'marzena.sikora@example.com'),
(25, 'Dariusz', 'Baran', '111222333', 'dariusz.baran@example.com'),
(26, 'Ewa', 'Tomaszewska', '999888777', 'ewa.tomaszewska@example.com'),
(27, 'Tadeusz', 'Piotrowski', '666555444', 'tadeusz.piotrowski@example.com'),
(28, 'Agata', 'Wróblewska', '555444333', 'agata.wroblewska@example.com'),
(29, 'Robert', 'Nowakowski', '222333444', 'robert.nowakowski@example.com'),
(30, 'Dominika', 'Kwiatkowska', '888999111', 'dominika.kwiatkowska@example.com');

-- --------------------------------------------------------

--
-- Table structure for table `estates`
--

CREATE TABLE `estates` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `is_bought` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `estates`
--

INSERT INTO `estates` (`id`, `name`, `address`, `price`, `is_bought`) VALUES
(1, 'Apartament przy Parku', 'ul. Kwiatowa 1, Warszawa', 250000.00, 0),
(2, 'Dom z ogrodem', 'ul. Słoneczna 2, Kraków', 450000.00, 0),
(3, 'Mieszkanie w centrum', 'ul. Główna 3, Wrocław', 180000.00, 0),
(4, 'Luksusowa willa', 'ul. Nadjeziorne 4, Gdańsk', 980000.00, 0),
(5, 'Kawalerka na wynajem', 'ul. Zielona 5, Poznań', 1200.00, 1),
(6, 'Apartamenty nad morzem', 'ul. Brzegowa 6, Sopot', 350000.00, 1),
(7, 'Dom w górach', 'ul. Skalista 7, Zakopane', 550000.00, 0),
(8, 'Mieszkanie z tarasem', 'ul. Spacerowa 8, Łódź', 220000.00, 0),
(9, 'Nowoczesny apartament', 'ul. Nowa 9, Szczecin', 280000.00, 1),
(10, 'Apartament w apartamentowcu', 'ul. Wieżowa 10, Katowice', 320000.00, 1),
(11, 'Mieszkanie w kamienicy', 'ul. Kamienista 11, Gdynia', 190000.00, 1),
(12, 'Dom na wsi', 'ul. Wiejska 12, Lublin', 420000.00, 0),
(13, 'Mieszkanie dla singla', 'ul. Singlowa 13, Bydgoszcz', 150000.00, 0),
(14, 'Luksusowy penthouse', 'ul. Wysoka 14, Rzeszów', 780000.00, 1),
(15, 'Apartament przy jeziorze', 'ul. Nadjeziorna 15, Olsztyn', 310000.00, 1),
(16, 'Mieszkanie dla rodziny', 'ul. Rodzinna 16, Opole', 200000.00, 0),
(17, 'Dom na osiedlu', 'ul. Osiedlowa 17, Zielona Góra', 480000.00, 0),
(18, 'Mieszkanie blisko centrum', 'ul. Centrum 18, Gorzów Wielkopolski', 170000.00, 0),
(19, 'Apartament z basenem', 'ul. Basenowa 19, Koszalin', 360000.00, 1),
(20, 'Mieszkanie dla studenta', 'ul. Akademicka 20, Legnica', 130000.00, 1),
(21, 'Komfortowy apartament', 'ul. Komfortowa 21, Częstochowa', 240000.00, 0),
(22, 'Dom na skraju lasu', 'ul. Lasowa 22, Kielce', 510000.00, 0),
(23, 'Mieszkanie z balkonem', 'ul. Balkonowa 23, Tarnów', 210000.00, 0),
(24, 'Apartament w historycznym budynku', 'ul. Historyczna 24, Płock', 330000.00, 1),
(25, 'Mieszkanie dla młodej pary', 'ul. Młodzieżowa 25, Radom', 160000.00, 1),
(26, 'Elegancki apartament', 'ul. Elegancka 26, Siedlce', 270000.00, 0),
(27, 'Dom z widokiem na jezioro', 'ul. Widokowa 27, Białystok', 590000.00, 0),
(28, 'Mieszkanie na parterze', 'ul. Parterowa 28, Ostrów Wielkopolski', 230000.00, 0),
(29, 'Apartament w stylowej kamienicy', 'ul. Stylowa 29, Kalisz', 340000.00, 1),
(30, 'Mieszkanie blisko plaży', 'ul. Plażowa 30, Toruń', 250000.00, 1),
(31, 'Wygodne mieszkanie', 'ul. Wygodna 31, Elbląg', 180000.00, 0),
(32, 'Dom z dużym ogrodem', 'ul. Ogrodowa 32, Gliwice', 460000.00, 0),
(33, 'Mieszkanie na poddaszu', 'ul. Poddasze 33, Krosno', 220000.00, 0),
(34, 'Apartament w centrum handlowym', 'ul. Handlowa 34, Tychy', 290000.00, 1),
(35, 'Mieszkanie w spokojnej okolicy', 'ul. Spokojna 35, Bielsko-Biała', 200000.00, 1),
(36, 'Dom na wzgórzu', 'ul. Wzgórzowa 36, Nowy Sącz', 550000.00, 0),
(37, 'Mieszkanie dla pracownika IT', 'ul. IT 37, Ruda Śląska', 150000.00, 0),
(38, 'Apartament z tarasem', 'ul. Tarasowa 38, Wałbrzych', 320000.00, 0),
(39, 'Mieszkanie dla emeryta', 'ul. Emerytów 39, Legnica', 190000.00, 1),
(40, 'Nowe mieszkanie', 'ul. Nowe 40, Gdynia', 240000.00, 1),
(41, 'Dom na przedmieściach', 'ul. Przedmieście 41, Lublin', 480000.00, 0),
(42, 'Mieszkanie z widokiem na rzekę', 'ul. Rzeczna 42, Bydgoszcz', 210000.00, 0),
(43, 'Apartament w luksusowym kompleksie', 'ul. Luksusowa 43, Rzeszów', 350000.00, 0),
(44, 'Mieszkanie dla rodziny z dziećmi', 'ul. Dziecięca 44, Olsztyn', 180000.00, 0),
(45, 'Dom z basenem', 'ul. Basenowa 45, Opole', 520000.00, 1),
(46, 'Mieszkanie na osiedlu zamkniętym', 'ul. Zamknięta 46, Zielona Góra', 250000.00, 0),
(47, 'Apartament blisko parku', 'ul. Parkowa 47, Gorzów Wielkopolski', 290000.00, 0),
(48, 'Mieszkanie w nowoczesnym budynku', 'ul. Nowoczesna 48, Koszalin', 200000.00, 0),
(49, 'Komfortowy apartament', 'ul. Komfortowa 49, Legnica', 280000.00, 0),
(50, 'Dom w malowniczej okolicy', 'ul. Malownicza 50, Częstochowa', 510000.00, 1),
(51, 'Mieszkanie z tarasem widokowym', 'ul. Taras Widokowy 51, Kielce', 220000.00, 0),
(52, 'Apartament w centrum handlowym', 'ul. Centrum Handlowe 52, Tarnów', 310000.00, 0),
(53, 'Mieszkanie na parterze z ogródkiem', 'ul. Parterowa 53, Płock', 190000.00, 0),
(54, 'Eleganckie studio', 'ul. Elegancka 54, Radom', 260000.00, 0),
(55, 'Dom w pobliżu lasu', 'ul. Lasowa 55, Siedlce', 530000.00, 1),
(56, 'Mieszkanie w centrum miasta', 'ul. Centrum 56, Białystok', 230000.00, 0),
(57, 'Apartament z widokiem na rzekę', 'ul. Rzeczna 57, Ostrów Wielkopolski', 330000.00, 0),
(58, 'Mieszkanie w kamienicy', 'ul. Kamienica 58, Kalisz', 200000.00, 0),
(59, 'Dom na skraju lasu', 'ul. Skraj Lasu 59, Toruń', 490000.00, 0),
(60, 'Mieszkanie dla singla', 'ul. Singlowa 60, Elbląg', 170000.00, 0);

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `id` int(11) NOT NULL,
  `client_id` int(11) DEFAULT NULL,
  `agent_id` int(11) DEFAULT NULL,
  `estate_id` int(11) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `state` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `transactions`
--
--

INSERT INTO `transactions` (`id`, `client_id`, `agent_id`, `estate_id`, `date`, `state`) VALUES
(1, 1, 2, 6, '2025-05-01', 1),
(2, 2, 3, 10, '2025-05-02', 2),
(3, 3, 1, 15, '2025-05-03', 1),
(4, 4, 2, 20, '2025-05-04', 2),
(5, 5, 3, 25, '2025-05-05', 1),
(6, 6, 1, 30, '2025-05-06', 2),
(7, 7, 2, 35, '2025-05-07', 1),
(8, 8, 3, 40, '2025-05-08', 2),
(9, 9, 1, 45, '2025-05-09', 1),
(10, 10, 2, 50, '2025-05-10', 2),
(11, 11, 3, 55, '2025-05-11', 1),
(12, 12, 1, 11, '2025-05-12', 2),
(13, 13, 2, 5, '2025-05-13', 1),
(14, 14, 3, 9, '2025-05-14', 2),
(15, 15, 1, 14, '2025-05-15', 1),
(16, 16, 2, 19, '2025-05-16', 2),
(17, 17, 3, 24, '2025-05-17', 1),
(18, 18, 1, 29, '2025-05-18', 2),
(19, 19, 2, 34, '2025-05-19', 1),
(20, 20, 3, 39, '2025-05-20', 2);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `agents`
--
ALTER TABLE `agents`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `clients`
--
ALTER TABLE `clients`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `estates`
--
ALTER TABLE `estates`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `client_id` (`client_id`),
  ADD KEY `agent_id` (`agent_id`),
  ADD KEY `estate_id` (`estate_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `agents`
--
ALTER TABLE `agents`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `clients`
--
ALTER TABLE `clients`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `estates`
--
ALTER TABLE `estates`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=61;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`),
  ADD CONSTRAINT `transactions_ibfk_2` FOREIGN KEY (`agent_id`) REFERENCES `agents` (`id`),
  ADD CONSTRAINT `transactions_ibfk_3` FOREIGN KEY (`estate_id`) REFERENCES `estates` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
