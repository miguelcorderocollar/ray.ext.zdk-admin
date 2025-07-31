import { Action, ActionPanel, Color, Icon, List } from "@raycast/api";
import { useState } from "react";
import { getZendeskInstances } from "./utils/preferences";

type ZendeskProduct = "support" | "guide" | "admin" | "explore" | "sell" | "chat" | "talk";

const productTitles: Record<ZendeskProduct, string> = {
  support: "Support",
  guide: "Guide",
  admin: "Admin",
  explore: "Explore",
  sell: "Sell",
  chat: "Chat",
  talk: "Talk",
};

export default function OpenZendeskInstance() {
  const instances = getZendeskInstances();
  const [product, setProduct] = useState<ZendeskProduct>("support");

  const getProductUrl = (subdomain: string, product: ZendeskProduct) => {
    switch (product) {
      case "support":
        return `https://${subdomain}.zendesk.com/agent`;
      case "guide":
        return `https://${subdomain}.zendesk.com/hc/admin`;
      case "admin":
        return `https://${subdomain}.zendesk.com/admin`;
      case "explore":
        return `https://${subdomain}.zendesk.com/explore`;
      case "sell":
        return `https://${subdomain}.zendesk.com/sell`;
      case "chat":
        return `https://${subdomain}.zendesk.com/chat`;
      case "talk":
        return `https://${subdomain}.zendesk.com/talk`;
    }
  };

  if (instances.length === 0) {
    return (
      <List>
        <List.EmptyView
          title="No Zendesk Instances Configured"
          description="Please add your Zendesk instances in the extension preferences."
        />
      </List>
    );
  }

  return (
    <List
      searchBarAccessory={
        <List.Dropdown
          tooltip="Select Zendesk Product"
          value={product}
          onChange={(newValue) => setProduct(newValue as ZendeskProduct)}
        >
          {Object.entries(productTitles).map(([value, title]) => (
            <List.Dropdown.Item key={value} title={title} value={value} />
          ))}
        </List.Dropdown>
      }
    >
      {instances.map((instance) => (
        <List.Item
          key={instance.subdomain}
          title={instance.name}
          subtitle={instance.subdomain}
          icon={{ source: Icon.House, tintColor: instance.color || Color.PrimaryText }}
          actions={
            <ActionPanel>
              <Action.OpenInBrowser
                title={`Open ${productTitles[product]}`}
                url={getProductUrl(instance.subdomain, product)}
              />
              <ActionPanel.Section>
                {Object.entries(productTitles).map(([value, title]) => (
                  <Action.OpenInBrowser
                    key={value}
                    title={`Open ${title}`}
                    url={getProductUrl(instance.subdomain, value as ZendeskProduct)}
                  />
                ))}
              </ActionPanel.Section>
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
