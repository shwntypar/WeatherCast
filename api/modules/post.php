<?php

require_once 'global.php';

class Post extends GlobalMethods
{
    private $pdo;
    private $openWeatherKey;

    public function __construct()
    {
        $this->openWeatherKey = $_ENV['WEATH_KEY'];
    }

    public function searchByCity($data)
    {
        $validMetricSystems = ['&units=standard', '&units=metric', '&units=imperial'];
        if (!in_array($data->metricSystem, $validMetricSystems)) {
            return $this->sendPayload(null, "failed", "Invalid metric system..", 400);
        }
        if (!isset($data->city) || empty($data->city)) {
            return $this->sendPayload(null, "failed", "Please enter a City.", 400);
        }


        $city = $data->city;
        $metricSystem = $data->metricSystem;
        $api_key = $this->openWeatherKey;
        
        $weather = "https://api.openweathermap.org/data/2.5/weather?q=$city&appid=$api_key&$metricSystem";

        $weatherResult = file_get_contents($weather);

        // Verify kung may files ba na nakuha
        if ($weatherResult === false) {
            return $this->sendPayload(null, "failed", "Unable to fetch weather data.", 500);
        }

        $weatherData = json_decode($weatherResult, true);

        // Verify kung may files ba na nakuha
        if (json_last_error() !== JSON_ERROR_NONE) {
            return $this->sendPayload(null, "failed", "Invalid JSON response.", 500);
        }

        // Verify kung may files ba na nakuha
        return $this->sendPayload($weatherData, "success", "Request Success!", 200);
    }

    private function curlSession($url)
    {
        $ch = curl_init();

        //Set the URL and other options
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_TIMEOUT, 10);

        $result = curl_exec($ch);

        //Check for curl errors
        if ($result === false) {
            $error = curl_error($ch);
            curl_close($ch);
            return $this->sendPayload(null, "failed", "Unable to fetch weather data.", 500);
        }

        //Close curl session
        curl_close($ch);

        return $result;
    }


    public function searchByLocation($data)
    {
        $validMetricSystems = ['&units=standard', '&units=metric', '&units=imperial'];
        if (!in_array($data->metricSystem, $validMetricSystems)) {
            return $this->sendPayload(null, "failed", "Invalid metric system..", 400);
        }
        if (!isset($data->lat) || !isset($data->lon)) {
            return $this->sendPayload(null, "failed", "Please enter a Location.", 400);
        }

        $lat = $data->lat;
        $lon = $data->lon;
        $metricSystem = $data->metricSystem;
        $api_key = $this->openWeatherKey;
        $weather = "https://api.openweathermap.org/data/2.5/weather?lat=$lat&lon=$lon&appid=$api_key&$metricSystem";

        // Nakuha na ang files
        $weatherResult = file_get_contents($weather);

        // Verify kung may files ba na nakuha
        if ($weatherResult === false) {
            return $this->sendPayload(null, "failed", "Unable to fetch weather data.", 500);
        }

        $weatherData = json_decode($weatherResult, true);

        // Verify kung may files ba na nakuha
        if (json_last_error() !== JSON_ERROR_NONE) {
            return $this->sendPayload(null, "failed", "Invalid JSON response.", 500);
        }

        // Verify kung may files ba na nakuha
        return $this->sendPayload($weatherData, "success", "Request Success!", 200);
    }

}