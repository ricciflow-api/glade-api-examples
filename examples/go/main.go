package main

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/url"
	"os"
	"strings"
	"time"
)

type price struct {
	Display  string  `json:"display"`
	Value    float64 `json:"value"`
	Currency string  `json:"currency"`
}

type product struct {
	ASIN    string  `json:"asin"`
	Title   string  `json:"title"`
	Brand   string  `json:"brand"`
	Price   *price  `json:"price"`
	Rating  float64 `json:"rating"`
	IsPrime *bool   `json:"isPrime"`
}

type envelope struct {
	Data struct {
		Product product `json:"amazonProduct"`
	} `json:"data"`
}

func main() {
	key := strings.TrimSpace(os.Getenv("GLADE_API_KEY"))
	if key == "" {
		log.Fatal("Set GLADE_API_KEY to a Glade API key")
	}
	baseURL := strings.TrimRight(os.Getenv("GLADE_API_BASE_URL"), "/")
	if baseURL == "" {
		baseURL = "https://gladeapi.com"
	}

	u, err := url.Parse(baseURL + "/api/amazon/product")
	if err != nil {
		log.Fatal(err)
	}
	query := u.Query()
	query.Set("asin", "B0D1XD1ZV3")
	query.Set("domain", "US")
	u.RawQuery = query.Encode()

	request, err := http.NewRequest(http.MethodGet, u.String(), nil)
	if err != nil {
		log.Fatal(err)
	}
	request.Header.Set("API-KEY", key)
	request.Header.Set("Accept", "application/json")
	request.Header.Set("User-Agent", "glade-api-examples-go/1.0")

	client := &http.Client{Timeout: 30 * time.Second}
	response, err := client.Do(request)
	if err != nil {
		log.Fatalf("request failed: %v", err)
	}
	defer response.Body.Close()
	body, err := io.ReadAll(io.LimitReader(response.Body, 2<<20))
	if err != nil {
		log.Fatal(err)
	}
	if response.StatusCode != http.StatusOK {
		log.Fatalf("Glade API returned HTTP %d: %s", response.StatusCode, body)
	}

	var payload envelope
	if err := json.Unmarshal(body, &payload); err != nil {
		log.Fatalf("decode failed: %v", err)
	}
	p := payload.Data.Product
	priceDisplay := "n/a"
	if p.Price != nil && p.Price.Display != "" {
		priceDisplay = p.Price.Display
	}
	fmt.Printf("%s (%s)\n", p.Title, p.ASIN)
	fmt.Printf("Brand: %s\n", p.Brand)
	fmt.Printf("Price: %s\n", priceDisplay)
	fmt.Printf("Rating: %.1f\n", p.Rating)
}
