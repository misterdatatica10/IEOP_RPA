import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

const tenantName = "DefaultTenant"; // Nome do Tenant
const organizationId = "6294362"; // ID da Organization Unit
const releaseKey = "78c634ab-a32c-404d-bd80-4578ed26eadf"; // Chave do processo publicado
const robotId = 1834416; // Substitua pelo ID do robô que será utilizado
const bearerToken = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlJUTkVOMEl5T1RWQk1UZEVRVEEzUlRZNE16UkJPVU00UVRRM016TXlSalUzUmpnMk4wSTBPQSJ9.eyJodHRwczovL3VpcGF0aC9lbWFpbCI6InBlZHJvMTBlaXJhQGdtYWlsLmNvbSIsImh0dHBzOi8vdWlwYXRoL2VtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczovL2FjY291bnQudWlwYXRoLmNvbS8iLCJzdWIiOiJnb29nbGUtb2F1dGgyfDEwNjk3MDE3NjQ2MzY4MzAzNTE0MCIsImF1ZCI6WyJodHRwczovL29yY2hlc3RyYXRvci5jbG91ZC51aXBhdGguY29tIiwiaHR0cHM6Ly91aXBhdGguZXUuYXV0aDAuY29tL3VzZXJpbmZvIl0sImlhdCI6MTczNzM4NjE4MSwiZXhwIjoxNzM3NDcyNTgxLCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIGVtYWlsIG9mZmxpbmVfYWNjZXNzIiwiYXpwIjoiOERFdjFBTU5YY3pXM3k0VTE1TEwzallmNjJqSzkzbjUifQ.A1kU7E6rAvvaA95JANNg7UD9_p3uNAoGls6xEva2fzpX4bm0Mu5q5liyu02iyhaIM7Mgbp5MLj2usbgkTIbpfS3TFkJLDRe2QrgtOXRcLXO9R1Z-W0ogMZIo-CoXcJ13OLg3wgvuDHzwUm0A8IuWg0CnF0KYSuNFWRLkiGNW_bTnHJ4WpDzZKjH5NK8BMuGDx-oF7WMna5S3-jXXiBtlt9BKmDjqORdmnXy3JJ1JVgalIT7tMIPtNY67YrHuQgYw0o_fwNJHMfpHL9gde21ZVmQtSTL6gs7-CMUyMVMbfbiaBXDoMghHIQVaKs3faKHwIc8sEV3qszNFL_NiETE1yg"; // Bearer Token fornecido

// Endpoint para iniciar o processo
app.post("/start-process", async (req, res) => {
    try {
        // Fazer a requisição para iniciar o processo no UiPath Orchestrator
        const processResponse = await fetch(
            `https://cloud.uipath.com/nomeorganiz/DefaultTenant/odata/Jobs/UiPath.Server.Configuration.OData.StartJobs`,
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${bearerToken}`,
                    "Content-Type": "application/json",
                    "X-UIPATH-TenantName": tenantName,
                    "X-UIPATH-OrganizationUnitId": organizationId,
                },
                body: JSON.stringify({
                    "startInfo": {
                        "ReleaseKey": releaseKey,
                        "Strategy": "Specific",
                        "RobotIds": [robotId],
                        "NoOfRobots": 0,
                    },
                }),
            }
        );
        
        // Verifique o texto bruto da resposta antes de convertê-lo para JSON
        const responseText = await processResponse.text();
        console.log("Response Text:", responseText);
        
        // Tente fazer o parse para JSON apenas se necessário
        let processData;
        try {
            processData = JSON.parse(responseText);
        } catch (err) {
            console.error("Erro ao fazer parse da resposta:", err.message);
            return res.status(500).json({
                error: "Erro inesperado",
                details: "A resposta não é um JSON válido",
                response: responseText,
            });
        }

        if (processResponse.ok) {
            return res.status(200).json({ message: "Processo iniciado com sucesso", data: processData });
        } else {
            return res.status(500).json({ error: "Erro ao iniciar o processo", details: processData });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro inesperado", details: error.message });
    }
});

// Iniciar servidor na porta 3000
const PORT = 5432;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
