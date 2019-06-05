import pandas as pd
import json

order_items = list()
with open("./order.json", "rb") as fin:
    data = json.load(fin)

    for order in data:
        if "items" in order:
            order_items.extend(order["items"])


with open("./order-items.json", "w") as fout:
    json.dump(order_items, fout, indent=4)


df = pd.read_json("./order-items.json", orient="column")
df["qty_ordered"] = df["qty_ordered"].astype(int)

units_by_sku_sorted = (
    df.groupby(["sku", "name"])["qty_ordered"]
    .sum()
    .reset_index(name="units")
    .sort_values(by="units", ascending=False)
)

units_by_sku_sorted.to_csv("./units_by_sku.csv")
