#!/bin/bash

# AsembleAI Backend Setup Script
# This script sets up the complete backend infrastructure

set -e

echo "========================================="
echo "AsembleAI Backend Setup"
echo "========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Error: Docker is not installed${NC}"
    echo "Please install Docker: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}Error: Docker Compose is not installed${NC}"
    echo "Please install Docker Compose: https://docs.docker.com/compose/install/"
    exit 1
fi

echo -e "${GREEN}✓${NC} Docker and Docker Compose are installed"
echo ""

# Step 1: Start infrastructure services
echo "Step 1: Starting infrastructure services..."
echo "This will start PostgreSQL, Redis, Kafka, ClickHouse, and Temporal"
echo ""

docker-compose up -d

echo ""
echo -e "${GREEN}✓${NC} Infrastructure services started"
echo ""

# Step 2: Wait for services to be ready
echo "Step 2: Waiting for services to be ready..."
echo "This may take 30-60 seconds..."
echo ""

sleep 10

# Wait for PostgreSQL
echo -n "Waiting for PostgreSQL..."
until docker exec asembleai-postgres pg_isready -U postgres > /dev/null 2>&1; do
    echo -n "."
    sleep 2
done
echo -e " ${GREEN}✓${NC}"

# Wait for Redis
echo -n "Waiting for Redis..."
until docker exec asembleai-redis redis-cli ping > /dev/null 2>&1; do
    echo -n "."
    sleep 2
done
echo -e " ${GREEN}✓${NC}"

# Wait for Kafka
echo -n "Waiting for Kafka..."
sleep 15  # Kafka takes longer to start
echo -e " ${GREEN}✓${NC}"

# Wait for ClickHouse
echo -n "Waiting for ClickHouse..."
until docker exec asembleai-clickhouse clickhouse-client --query "SELECT 1" > /dev/null 2>&1; do
    echo -n "."
    sleep 2
done
echo -e " ${GREEN}✓${NC}"

echo ""
echo -e "${GREEN}✓${NC} All services are ready"
echo ""

# Step 3: Initialize databases
echo "Step 3: Initializing databases..."
echo ""

# PostgreSQL schema and seed data
echo "Setting up PostgreSQL schema..."
docker exec -i asembleai-postgres psql -U postgres -d asembleai < database/schema.sql > /dev/null 2>&1
echo -e "${GREEN}✓${NC} PostgreSQL schema created"

echo "Loading PostgreSQL seed data..."
docker exec -i asembleai-postgres psql -U postgres -d asembleai < database/seed.sql > /dev/null 2>&1
echo -e "${GREEN}✓${NC} PostgreSQL seed data loaded"

# ClickHouse schema
echo "Setting up ClickHouse schema..."
docker exec -i asembleai-clickhouse clickhouse-client --multiquery < database/clickhouse_schema.sql > /dev/null 2>&1
echo -e "${GREEN}✓${NC} ClickHouse schema created"

echo ""
echo -e "${GREEN}✓${NC} Databases initialized"
echo ""

# Step 4: Setup API Gateway
echo "Step 4: Setting up API Gateway..."
echo ""

cd api-gateway

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
    echo -e "${GREEN}✓${NC} Virtual environment created"
fi

# Activate virtual environment and install dependencies
echo "Installing Python dependencies..."
source venv/bin/activate
pip install -q --upgrade pip
pip install -q -r requirements.txt
echo -e "${GREEN}✓${NC} Python dependencies installed"

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cp .env.example .env
    echo -e "${GREEN}✓${NC} .env file created"
    echo -e "${YELLOW}⚠${NC}  Please update .env with your actual credentials"
fi

# Create logs directory
mkdir -p logs

deactivate
cd ..

echo ""
echo -e "${GREEN}✓${NC} API Gateway setup complete"
echo ""

# Step 5: Display service URLs
echo "========================================="
echo "Setup Complete!"
echo "========================================="
echo ""
echo "Services are running:"
echo ""
echo "  PostgreSQL:     localhost:5432"
echo "  Redis:          localhost:6379"
echo "  Kafka:          localhost:9092"
echo "  ClickHouse:     localhost:8123"
echo "  Temporal:       localhost:7233"
echo "  Temporal Web:   http://localhost:8089"
echo "  Prometheus:     http://localhost:9090"
echo "  Grafana:        http://localhost:3000 (admin/admin)"
echo "  Jaeger:         http://localhost:16686"
echo ""
echo "========================================="
echo "Next Steps:"
echo "========================================="
echo ""
echo "1. Start the API Gateway:"
echo "   cd api-gateway"
echo "   source venv/bin/activate"
echo "   uvicorn main:app --reload --host 0.0.0.0 --port 8000"
echo ""
echo "2. Access API documentation:"
echo "   http://localhost:8000/docs"
echo ""
echo "3. Login with demo credentials:"
echo "   Owner:     owner@asembleai.com / owner123"
echo "   Developer: dev@asembleai.com / dev123"
echo ""
echo "4. View logs:"
echo "   docker-compose logs -f [service-name]"
echo ""
echo "5. Stop services:"
echo "   docker-compose down"
echo ""
echo "========================================="
echo ""
