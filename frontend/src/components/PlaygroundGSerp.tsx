import React, { useState } from "react";
import {
  Box,
  Text,
  Flex,
  Button,
  Input,
  Select,
  Textarea,
  Spinner,
  Tooltip,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  IconButton,
  Heading,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { FiSend } from "react-icons/fi";

// Define regions based on backend REGION_ENDPOINTS
const REGIONS = [
  "us-east",
  "us-west",
  "us-central",
  "northamerica-northeast",
  "southamerica",
  "asia",
  "australia",
  "europe",
  "middle-east"
];

const API_URL = "https://api.thedataproxy.com/v2/proxy";

const PlaygroundGSerp: React.FC = () => {
  const [url, setUrl] = useState<string>("https://www.google.com/search?q=flowers&udm=2");
  const [region, setRegion] = useState<string>(REGIONS[0]);
  const [apiKey, setApiKey] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [htmlPreview, setHtmlPreview] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleTestRequest = async () => {
    setIsLoading(true);
    setResponse("");
    setHtmlPreview("");
    setError("");

    try {
      const res = await fetch(`${API_URL}/fetch?region=${region}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
        },
        body: JSON.stringify({ url }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || `HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setResponse(JSON.stringify(data, null, 2));
      if (data.result) {
        setHtmlPreview(data.result);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box width="100%">
      <Heading size="md" mb={4}>Test Proxy Request</Heading>
      <Box mb={6}>
        <Flex direction="column" gap={4}>
          <Flex direction="column" gap={4}>
            <FormControl>
              <FormLabel fontSize="sm">Search URL</FormLabel>
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="e.g., https://www.google.com/search?q=flowers&udm=2"
                size="sm"
                isRequired
              />
            </FormControl>
            <Flex direction="row" gap={4}>
              <FormControl flex="1">
                <FormLabel fontSize="sm">API Key</FormLabel>
                <Input
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your API key"
                  size="sm"
                  type="password"
                  isRequired
                />
              </FormControl>
              <FormControl flex="1">
                <FormLabel fontSize="sm">Region</FormLabel>
                <Select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  size="sm"
                >
                  {REGIONS.map((reg) => (
                    <option key={reg} value={reg}>
                      {reg}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </Flex>
            <Tooltip label="Send test request">
              <Button
                size="sm"
                colorScheme="blue"
                onClick={handleTestRequest}
                isLoading={isLoading}
                isDisabled={!url.trim() || !apiKey.trim() || !region}
              >
                <FiSend />
              </Button>
            </Tooltip>
          </Flex>
          {error && (
            <Alert status="error">
              <AlertIcon />
              <Text fontSize="sm">{error}</Text>
            </Alert>
          )}
        </Flex>
      </Box>
      <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6}>
        <GridItem>
          <Heading size="md" mb={4}>Response</Heading>
          {isLoading ? (
            <Flex justify="center" align="center" h="400px">
              <Spinner size="xl" color="blue.500" />
            </Flex>
          ) : (
            <Textarea
              value={response}
              readOnly
              height="400px"
              bg="blue.50"
              color="black"
              placeholder="Response will appear here after testing"
              size="sm"
              resize="vertical"
            />
          )}
        </GridItem>
        <GridItem>
          <Flex align="center" justify="space-between" mb={4}>
            <Heading size="md">HTML Preview</Heading>
            {htmlPreview && (
              <Tooltip label="Open preview in new tab">
                <IconButton
                  aria-label="Open preview"
                  icon={<ExternalLinkIcon />}
                  size="sm"
                  onClick={() => {
                    const newWindow = window.open("", "_blank");
                    if (newWindow) {
                      newWindow.document.write(htmlPreview);
                      newWindow.document.close();
                    } else {
                      alert("Popup blocked. Please allow popups for this site.");
                    }
                  }}
                />
              </Tooltip>
            )}
          </Flex>
          {htmlPreview ? (
            <iframe
              srcDoc={htmlPreview}
              style={{ width: "100%", height: "400px", border: "1px solid #ccc" }}
              title="HTML Preview"
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
            />
          ) : (
            <Box height="400px" bg="gray.100" borderRadius="md" display="flex" alignItems="center" justifyContent="center">
              <Text fontSize="sm" color="gray.500">No preview available</Text>
            </Box>
          )}
        </GridItem>
      </Grid>
    </Box>
  );
};

export default PlaygroundGSerp;