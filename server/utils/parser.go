package utils

import (
	"fmt"
	"io"
	"strconv"
	"strings"

	"github.com/xuri/excelize/v2"
	"portfolio-manager/server/models"
)

var headerAliases = map[string]string{
	"symbol":        "symbol",
	"ticker":        "symbol",
	"name":          "name",
	"company":       "name",
	"stock":         "name",
	"quantity":      "quantity",
	"qty":           "quantity",
	"shares":        "quantity",
	"buyprice":      "buyPrice",
	"buy_price":     "buyPrice",
	"price":         "buyPrice",
	"cost":          "buyPrice",
	"avgprice":      "buyPrice",
	"currentprice":  "currentPrice",
	"current_price": "currentPrice",
	"market_price":  "currentPrice",
	"ltp":           "currentPrice",
	"sector":        "sector",
	"industry":      "sector",
	"assettype":     "assetType",
	"asset_type":    "assetType",
	"type":          "assetType",
}

func normalizeHeader(h string) string {
	key := strings.ToLower(strings.TrimSpace(h))
	key = strings.ReplaceAll(key, " ", "")
	if mapped, ok := headerAliases[key]; ok {
		return mapped
	}
	// also try with underscores preserved
	key2 := strings.ReplaceAll(strings.ToLower(strings.TrimSpace(h)), " ", "_")
	if mapped, ok := headerAliases[key2]; ok {
		return mapped
	}
	return ""
}

func parseFloat(s string) float64 {
	s = strings.TrimSpace(strings.ReplaceAll(s, ",", ""))
	if s == "" {
		return 0
	}
	f, _ := strconv.ParseFloat(s, 64)
	return f
}

// ParseHoldings reads an Excel/CSV file from r and returns parsed holdings.
func ParseHoldings(r io.Reader, filename string) ([]models.Holding, error) {
	f, err := excelize.OpenReader(r)
	if err != nil {
		return nil, fmt.Errorf("open file: %w", err)
	}
	defer f.Close()

	sheets := f.GetSheetList()
	if len(sheets) == 0 {
		return nil, fmt.Errorf("no sheets in file")
	}
	rows, err := f.GetRows(sheets[0])
	if err != nil {
		return nil, fmt.Errorf("read rows: %w", err)
	}
	if len(rows) < 2 {
		return nil, fmt.Errorf("file has no data rows")
	}

	headerRow := rows[0]
	colMap := map[string]int{}
	for i, h := range headerRow {
		field := normalizeHeader(h)
		if field != "" {
			colMap[field] = i
		}
	}

	if _, ok := colMap["symbol"]; !ok {
		return nil, fmt.Errorf("required column 'symbol' missing")
	}
	if _, ok := colMap["quantity"]; !ok {
		return nil, fmt.Errorf("required column 'quantity' missing")
	}

	get := func(row []string, key string) string {
		if idx, ok := colMap[key]; ok && idx < len(row) {
			return row[idx]
		}
		return ""
	}

	var holdings []models.Holding
	for i := 1; i < len(rows); i++ {
		row := rows[i]
		if len(row) == 0 {
			continue
		}
		symbol := strings.ToUpper(strings.TrimSpace(get(row, "symbol")))
		if symbol == "" {
			continue
		}
		qty := parseFloat(get(row, "quantity"))
		if qty <= 0 {
			continue
		}
		assetType := strings.TrimSpace(get(row, "assetType"))
		if assetType == "" {
			assetType = "Stock"
		}
		sector := strings.TrimSpace(get(row, "sector"))
		if sector == "" {
			sector = "Other"
		}
		h := models.Holding{
			Symbol:       symbol,
			Name:         strings.TrimSpace(get(row, "name")),
			Quantity:     qty,
			BuyPrice:     parseFloat(get(row, "buyPrice")),
			CurrentPrice: parseFloat(get(row, "currentPrice")),
			Sector:       sector,
			AssetType:    assetType,
		}
		holdings = append(holdings, h)
	}

	if len(holdings) == 0 {
		return nil, fmt.Errorf("no valid holdings found")
	}
	return holdings, nil
}
