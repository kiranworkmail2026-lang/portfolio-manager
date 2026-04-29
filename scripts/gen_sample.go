//go:build ignore

package main

import (
	"fmt"
	"log"

	"github.com/xuri/excelize/v2"
)

func main() {
	f := excelize.NewFile()
	defer f.Close()
	sheet := "Sheet1"

	rows := [][]interface{}{
		{"Symbol", "Name", "Quantity", "BuyPrice", "CurrentPrice", "Sector", "AssetType"},
		{"AAPL", "Apple Inc", 50, 142.50, 178.20, "Technology", "Stock"},
		{"MSFT", "Microsoft Corp", 30, 280.00, 338.50, "Technology", "Stock"},
		{"GOOGL", "Alphabet Inc", 20, 130.00, 142.80, "Technology", "Stock"},
		{"NVDA", "NVIDIA Corp", 15, 220.00, 480.00, "Technology", "Stock"},
		{"TSLA", "Tesla Inc", 25, 240.00, 195.50, "Consumer Discretionary", "Stock"},
		{"AMZN", "Amazon.com Inc", 18, 130.00, 152.30, "Consumer Discretionary", "Stock"},
		{"JPM", "JPMorgan Chase", 40, 140.00, 165.20, "Financials", "Stock"},
		{"JNJ", "Johnson & Johnson", 35, 165.00, 158.40, "Healthcare", "Stock"},
		{"VTI", "Vanguard Total Market", 100, 200.00, 220.50, "Index", "ETF"},
		{"BND", "Vanguard Total Bond", 80, 75.00, 72.30, "Bonds", "ETF"},
	}

	for i, row := range rows {
		cell, _ := excelize.CoordinatesToCellName(1, i+1)
		f.SetSheetRow(sheet, cell, &row)
	}

	out := "sample_portfolio.xlsx"
	if err := f.SaveAs(out); err != nil {
		log.Fatal(err)
	}
	fmt.Println("wrote", out)
}
