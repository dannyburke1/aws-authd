package main

import (
	"fmt"
	"net/http"
)

const (
	URL     = "https://u3x5pjvhnrfprdzrneskrg3haa.appsync-api.us-east-1.amazonaws.com/graphql"
	API_KEY = "da2-ictebesvojddboeemnqrtxaybu" #Dummy API Key.
)

func main() {

	client := &http.Client{}

	req, err := http.NewRequest("GET", URL, nil)

	req.Header.Add("x-api-key:", API_KEY)

	resp, err := client.Do(req)
	

	if err != nil {
		fmt.Println("cannot connect to AppSync")
	}

	fmt.Println(resp.Body)
}
