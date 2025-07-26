"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  ConfigProvider,
  Spin,
  Button,
  Typography,
  Card,
  Tag,
  Popover,
  DatePicker,
  Input,
  Select,
  Row,
  Col,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import styled, { createGlobalStyle } from "styled-components";
import {
  ReloadOutlined,
  TrophyOutlined,
  CalendarOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import "antd/dist/reset.css";
import dayjs from "dayjs";

const { Text, Title } = Typography;
const { Search } = Input;
const { Option } = Select;

const GlobalScrollbarStyle = createGlobalStyle`
  /* Modern Scrollbar Styling */
  * {
    scrollbar-width: thin;
    scrollbar-color: #10a37f #1f1f1f;
  }
  
  *::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  
  *::-webkit-scrollbar-track {
    background: #1f1f1f;
    border-radius: 4px;
  }
  
  *::-webkit-scrollbar-thumb {
    background: #10a37f;
    border-radius: 4px;
    transition: background 0.2s;
  }
  
  *::-webkit-scrollbar-thumb:hover {
    background: #0d8a6f;
  }
  
  /* Ant Design Table Enhancements */
  .ant-table {
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }
  
  .ant-table-header {
    background: linear-gradient(135deg, #1f1f1f 0%, #2a2a2a 100%);
    border-bottom: 2px solid #10a37f;
  }
  
  .ant-table-thead > tr > th {
    background: transparent !important;
    border-bottom: 1px solid #333;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-size: 12px;
    padding: 16px 12px;
  }
  
  .ant-table-tbody > tr > td {
    padding: 12px;
    border-bottom: 1px solid #2a2a2a;
    transition: all 0.2s ease;
  }
  
  .ant-table-tbody > tr:hover > td {
    background: linear-gradient(135deg, #2a2a2a 0%, #333 100%) !important;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(16, 163, 127, 0.1);
  }
  
  .ant-table-tbody > tr:nth-child(even) > td {
    background: rgba(16, 163, 127, 0.02);
  }
  
  /* Mobile Responsive */
  @media (max-width: 768px) {
    .ant-table-thead > tr > th,
    .ant-table-tbody > tr > td {
      padding: 8px 6px;
      font-size: 12px;
    }
    
    .ant-table-thead > tr > th {
      font-size: 11px;
      padding: 10px 6px;
    }
  }
  
  /* Pagination Styling */
  .ant-pagination {
    margin-top: 20px;
    text-align: center;
  }
  
  .ant-pagination-item {
    border-radius: 8px;
    border: 1px solid #333;
    background: #1f1f1f;
    color: #ececf1;
  }
  
  .ant-pagination-item:hover {
    border-color: #10a37f;
    background: #2a2a2a;
  }
  
  .ant-pagination-item-active {
    background: #10a37f;
    border-color: #10a37f;
  }
  
  .ant-pagination-prev,
  .ant-pagination-next {
    border-radius: 8px;
    border: 1px solid #333;
    background: #1f1f1f;
    color: #ececf1;
  }
  
  .ant-pagination-prev:hover,
  .ant-pagination-next:hover {
    border-color: #10a37f;
    background: #2a2a2a;
  }
`;

const DashboardContainer = styled.div`
  /* min-height: 100vh; */
  overflow-x: hidden;
  overflow-y: auto;
  background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
  padding: 20px;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    sans-serif;
  margin-bottom: 20px;
  @media (max-width: 768px) {
    padding: 12px;
  }
`;

const HeaderSection = styled.div`
  margin-bottom: 24px;
  text-align: center;

  @media (max-width: 768px) {
    margin-bottom: 16px;
  }
`;

const DashboardTitle = styled(Title)`
  color: #ececf1 !important;
  margin-bottom: 8px !important;
  font-weight: 700 !important;
  font-size: 2.5rem !important;

  @media (max-width: 768px) {
    font-size: 1.8rem !important;
  }
`;

const DashboardSubtitle = styled(Text)`
  color: #8e8ea0 !important;
  font-size: 1.1rem !important;
  display: block !important;
  margin-bottom: 16px !important;

  @media (max-width: 768px) {
    font-size: 0.9rem !important;
  }
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 12px;
    margin-bottom: 16px;
  }
`;

const StatCard = styled(Card)`
  background: linear-gradient(135deg, #1f1f1f 0%, #2a2a2a 100%);
  border: 1px solid #333;
  border-radius: 12px;
  text-align: center;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(16, 163, 127, 0.15);
    border-color: #10a37f;
  }

  .ant-card-body {
    padding: 20px 16px;
  }

  @media (max-width: 768px) {
    .ant-card-body {
      padding: 16px 12px;
    }
  }
`;

const TableWrapper = styled.div`
  background: #1f1f1f;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    border-radius: 8px;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  background: linear-gradient(135deg, #1f1f1f 0%, #2a2a2a 100%);
  border-radius: 12px;
  padding: 40px 20px;

  @media (max-width: 768px) {
    min-height: 300px;
    padding: 30px 16px;
  }
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  background: linear-gradient(135deg, #1f1f1f 0%, #2a2a2a 100%);
  border-radius: 12px;
  padding: 40px 20px;
  text-align: center;

  @media (max-width: 768px) {
    min-height: 300px;
    padding: 30px 16px;
  }
`;

const EmptyContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  background: linear-gradient(135deg, #1f1f1f 0%, #2a2a2a 100%);
  border-radius: 12px;
  padding: 40px 20px;
  text-align: center;

  @media (max-width: 768px) {
    min-height: 300px;
    padding: 30px 16px;
  }
`;

const ActionButton = styled(Button)`
  background: linear-gradient(135deg, #10a37f 0%, #0d8a6f 100%);
  border: none;
  border-radius: 8px;
  height: 40px;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(135deg, #0d8a6f 0%, #0b7a5f 100%);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(16, 163, 127, 0.3);
  }

  @media (max-width: 768px) {
    height: 36px;
    font-size: 14px;
  }
`;

const AccuracyTag = styled(Tag)`
  border-radius: 6px;
  font-weight: 600;
  border: none;
  padding: 4px 8px;

  &.high {
    background: linear-gradient(135deg, #52c41a 0%, #389e0d 100%);
    color: white;
  }

  &.medium {
    background: linear-gradient(135deg, #faad14 0%, #d48806 100%);
    color: white;
  }

  &.low {
    background: linear-gradient(135deg, #ff4d4f 0%, #cf1322 100%);
    color: white;
  }
`;

const TeamName = styled.span`
  font-weight: 600;
  color: #10a37f;
`;

const ScoreDisplay = styled.span`
  font-weight: 700;
  font-size: 1.1em;
  color: #10a37f;
  background: rgba(16, 163, 127, 0.1);
  padding: 4px 8px;
  border-radius: 6px;
  border: 1px solid rgba(16, 163, 127, 0.2);
`;

// Responsive grid for popover details
const PopoverDetailsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 12px;
  max-width: 600px;
  min-width: 260px;
  overflow-x: auto;
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    min-width: 200px;
    max-width: 95vw;
  }
`;

// Responsive filter row
const FiltersRow = styled(Row)`
  margin-bottom: 20px;
  @media (max-width: 768px) {
    flex-direction: column !important;
    gap: 10px;
  }
`;

const whiteInputStyle = {
  color: '#fff',
};

const WhitePlaceholderStyle = createGlobalStyle`
  .white-placeholder input::placeholder,
  .white-placeholder .ant-select-selection-placeholder {
    color: #fff !important;
    opacity: 1 !important;
  }
  .white-placeholder .ant-select-selection-item {
    color: #fff !important;
  }
`;

interface DashboardRow {
  key: number;
  homeTeam: string;
  awayTeam: string;
  fixtureId: number;
  dateTime: string;
  timezone: string;
  predictionWinTeam: string;
  predictionLossTeam: string;
  country: string;
  league: string;
  reasonForWin: string;
  reasonsForLoss: string;
  predictedScore: string;
  predictionAccuracy: number;
  overallAnalytics: string;
}

const DashboardTable: React.FC = () => {
  const [data, setData] = useState<DashboardRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterDate, setFilterDate] = useState<string | null>(null);
  const [filterName, setFilterName] = useState<string>("");
  const [filterLeague, setFilterLeague] = useState<string>("all");

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        "https://n8n.srv926513.hstgr.cloud/webhook/get-table-data"
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const apiData = await response.json();
      const array = Array.isArray(apiData) ? apiData : apiData.data;
      if (!Array.isArray(array)) throw new Error("API did not return an array");

      const transformedData: DashboardRow[] = array.map((item, index) => ({
        key: item.row_number || index + 1,
        homeTeam: item["Home Team"],
        awayTeam: item["Away Team"],
        fixtureId: item["Fixture ID"],
        dateTime: item.DateTime,
        timezone: item.Timezone,
        predictionWinTeam: item["Prediction Win Team"],
        predictionLossTeam: item["Prediction Loss Team"],
        country: item.Country,
        league: item.League,
        reasonForWin: item["Reason For Win"],
        reasonsForLoss: item["Reasons for Loss"],
        predictedScore: item["Predicted Score"],
        predictionAccuracy: item["Prediction Accuracy"],
        overallAnalytics: item["Overall Analytics"],
      }));

      setData(transformedData);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getAccuracyClass = (accuracy: number) => {
    if (accuracy >= 80) return "high";
    if (accuracy >= 60) return "medium";
    return "low";
  };

  const formatDateTime = (dateTime: string) => {
    try {
      const date = new Date(dateTime);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateTime;
    }
  };

  const columns: ColumnsType<DashboardRow> = [
    {
      title: (
        <>
          <TrophyOutlined /> Match
        </>
      ),
      key: "match",
      width: 200,
      render: (_, record) => (
        <div style={{ textAlign: "left" }}>
          <div>
            <TeamName>{record.homeTeam}</TeamName>
          </div>
          <div style={{ fontSize: "12px", color: "#8e8ea0" }}>vs</div>
          <div>
            <TeamName>{record.awayTeam}</TeamName>
          </div>
        </div>
      ),
      responsive: ["md"],
    },
    {
      title: (
        <>
          <CalendarOutlined /> Date/Time
        </>
      ),
      dataIndex: "dateTime",
      key: "dateTime",
      width: 150,
      render: (dateTime) => (
        <div style={{ fontSize: "12px" }}>
          <div>{formatDateTime(dateTime)}</div>
        </div>
      ),
      responsive: ["lg"],
    },
    {
      title: (
        <>
          <GlobalOutlined /> League
        </>
      ),
      key: "league",
      width: 120,
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 600, fontSize: "12px" }}>
            {record.league}
          </div>
          <div style={{ fontSize: "11px", color: "#8e8ea0" }}>
            {record.country}
          </div>
        </div>
      ),
      responsive: ["md"],
    },
    {
      title: "Prediction",
      key: "prediction",
      width: 150,
      render: (_, record) => (
        <div style={{ textAlign: "center" }}>
          <div style={{ fontWeight: 600, color: "#52c41a" }}>
            Win: {record.predictionWinTeam}
          </div>
          <div style={{ fontSize: "12px", color: "#8e8ea0" }}>
            Loss: {record.predictionLossTeam}
          </div>
        </div>
      ),
      responsive: ["sm"],
    },
    {
      title: "Score",
      dataIndex: "predictedScore",
      key: "predictedScore",
      width: 100,
      render: (score) => <ScoreDisplay>{score}</ScoreDisplay>,
      responsive: ["sm"],
    },
    {
      title: "Accuracy",
      dataIndex: "predictionAccuracy",
      key: "predictionAccuracy",
      width: 100,
      render: (accuracy) => (
        <AccuracyTag className={getAccuracyClass(accuracy)}>
          {accuracy}%
        </AccuracyTag>
      ),
    },
    {
      title: "Details",
      key: "details",
      width: 120,
      render: (_, record) => (
        <Popover
          content={
            <PopoverDetailsGrid>
              <div>
                <strong>Win Reason</strong>
                <div
                  style={{
                    whiteSpace: "pre-line",
                    wordBreak: "break-word",
                    fontSize: 13,
                  }}
                >
                  {record.reasonForWin}
                </div>
              </div>
              <div>
                <strong>Loss Reason</strong>
                <div
                  style={{
                    whiteSpace: "pre-line",
                    wordBreak: "break-word",
                    fontSize: 13,
                  }}
                >
                  {record.reasonsForLoss}
                </div>
              </div>
              <div>
                <strong>Analytics</strong>
                <div
                  style={{
                    whiteSpace: "pre-line",
                    wordBreak: "break-word",
                    fontSize: 13,
                  }}
                >
                  {record.overallAnalytics}
                </div>
              </div>
            </PopoverDetailsGrid>
          }
          title="Match Details"
          trigger="click"
          placement="left"
        >
          <a style={{ color: "#10a37f", cursor: "pointer" }}>View Details</a>
        </Popover>
      ),
    },
  ];

  const stats = {
    totalMatches: data.length,
    averageAccuracy:
      data.length > 0
        ? Math.round(
            data.reduce((sum, item) => sum + item.predictionAccuracy, 0) /
              data.length
          )
        : 0,
    highAccuracyMatches: data.filter((item) => item.predictionAccuracy >= 80)
      .length,
    uniqueLeagues: new Set(data.map((item) => item.league)).size,
  };

  // Unique leagues for dropdown
  const leagueOptions = Array.from(new Set(data.map((item) => item.league)));

  // Filtered data
  const filteredData = data.filter((item) => {
    let match = true;
    // Date filter (exact date)
    if (filterDate) {
      const itemDate = dayjs(item.dateTime).format("YYYY-MM-DD");
      if (itemDate !== filterDate) match = false;
    }
    // Name filter (home or away team)
    if (filterName) {
      const name = filterName.toLowerCase();
      if (
        !item.homeTeam.toLowerCase().includes(name) &&
        !item.awayTeam.toLowerCase().includes(name)
      ) {
        match = false;
      }
    }
    // League filter
    if (filterLeague !== "all" && item.league !== filterLeague) {
      match = false;
    }
    return match;
  });

  if (loading) {
    return (
      <ConfigProvider
        theme={{
          token: {
            colorBgContainer: "#1f1f1f",
            colorText: "#ececf1",
            colorBorder: "#333",
            colorPrimary: "#10a37f",
            colorBgElevated: "#2a2a2a",
            borderRadius: 8,
          },
        }}
      >
        <GlobalScrollbarStyle />
        <DashboardContainer>
          <HeaderSection>
            <DashboardTitle>Football Predictions Dashboard</DashboardTitle>
            <DashboardSubtitle>
              Real-time match predictions and analytics
            </DashboardSubtitle>
          </HeaderSection>
          <LoadingContainer>
            <Spin size="large" style={{ marginBottom: 16 }} />
            <Title level={3} style={{ color: "#ececf1", marginBottom: 8 }}>
              Loading Data...
            </Title>
            <Text style={{ color: "#8e8ea0" }}>
              Fetching the latest predictions and analytics
            </Text>
          </LoadingContainer>
        </DashboardContainer>
      </ConfigProvider>
    );
  }

  if (error) {
    return (
      <ConfigProvider
        theme={{
          token: {
            colorBgContainer: "#1f1f1f",
            colorText: "#ececf1",
            colorBorder: "#333",
            colorPrimary: "#10a37f",
            colorBgElevated: "#2a2a2a",
            borderRadius: 8,
          },
        }}
      >
        <GlobalScrollbarStyle />
        <DashboardContainer>
          <HeaderSection>
            <DashboardTitle>Football Predictions Dashboard</DashboardTitle>
            <DashboardSubtitle>
              Real-time match predictions and analytics
            </DashboardSubtitle>
          </HeaderSection>
          <ErrorContainer>
            <span style={{ fontSize: 48, marginBottom: 16 }}>⚠️</span>
            <Title level={3} style={{ color: "#ececf1", marginBottom: 8 }}>
              Error Loading Data
            </Title>
            <Text
              style={{ color: "#8e8ea0", marginBottom: 20, display: "block" }}
            >
              {error}
            </Text>
            <ActionButton icon={<ReloadOutlined />} onClick={fetchData}>
              Retry
            </ActionButton>
          </ErrorContainer>
        </DashboardContainer>
      </ConfigProvider>
    );
  }

  return (
    <ConfigProvider
      theme={{
        token: {
          colorBgContainer: "#1f1f1f",
          colorText: "#ececf1",
          colorBorder: "#333",
          colorPrimary: "#10a37f",
          colorBgElevated: "#2a2a2a",
          borderRadius: 8,
        },
      }}
    >
      <GlobalScrollbarStyle />
      <WhitePlaceholderStyle />
      <DashboardContainer>
        {data.length > 0 && (
          <StatsContainer>
            <StatCard>
              <Title level={4} style={{ color: "#ececf1", margin: 0 }}>
                {stats.totalMatches}
              </Title>
              <Text style={{ color: "#8e8ea0" }}>Total Matches</Text>
            </StatCard>
            <StatCard>
              <Title level={4} style={{ color: "#ececf1", margin: 0 }}>
                {stats.averageAccuracy}%
              </Title>
              <Text style={{ color: "#8e8ea0" }}>Average Accuracy</Text>
            </StatCard>
            <StatCard>
              <Title level={4} style={{ color: "#ececf1", margin: 0 }}>
                {stats.highAccuracyMatches}
              </Title>
              <Text style={{ color: "#8e8ea0" }}>High Accuracy (≥80%)</Text>
            </StatCard>
            <StatCard>
              <Title level={4} style={{ color: "#ececf1", margin: 0 }}>
                {stats.uniqueLeagues}
              </Title>
              <Text style={{ color: "#8e8ea0" }}>Unique Leagues</Text>
            </StatCard>
          </StatsContainer>
        )}
        {/* Filters Row */}
        <FiltersRow gutter={[12, 12]} justify="start">
          <Col xs={24} sm={12} md={8} lg={6}>
            <DatePicker
              style={{ ...whiteInputStyle, width: '100%' }}
              allowClear
              placeholder="Filter by Date"
              onChange={(date) =>
                setFilterDate(date ? date.format("YYYY-MM-DD") : null)
              }
              inputReadOnly={false}
              
              popupStyle={{ color: '#fff' }}
              // AntD doesn't support placeholder style directly, so use className
              className="white-placeholder"
            />
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Search
              allowClear
              placeholder="Search by Team Name"
              onChange={(e) => setFilterName(e.target.value)}
              value={filterName}
              style={{ ...whiteInputStyle, width: '100%' }}
              className="white-placeholder"
            />
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Select
              allowClear
              style={{ ...whiteInputStyle, width: '100%' }}
              placeholder="Filter by League"
              value={filterLeague === "all" ? undefined : filterLeague}
              onChange={(val) => setFilterLeague(val || "all")}
              dropdownStyle={{ background: '#2a2a2a', color: '#fff' }}
              className="white-placeholder"
            >
              <Option value="all">All Leagues</Option>
              {leagueOptions.map((league) => (
                <Option key={league} value={league}>
                  {league}
                </Option>
              ))}
            </Select>
          </Col>
        </FiltersRow>
        <TableWrapper>
          {filteredData.length === 0 ? (
            <EmptyContainer>
              <span style={{ fontSize: 48, marginBottom: 16 }}>📊</span>
              <Title level={3} style={{ color: "#ececf1", marginBottom: 8 }}>
                No Data Available
              </Title>
              <Text
                style={{ color: "#8e8ea0", marginBottom: 20, display: "block" }}
              >
                There are currently no predictions to display.
              </Text>
              <ActionButton icon={<ReloadOutlined />} onClick={fetchData}>
                Refresh Data
              </ActionButton>
            </EmptyContainer>
          ) : (
            <Table
              columns={columns}
              dataSource={filteredData}
              pagination={{
                pageSize: 10,
                showSizeChanger: false,
                showQuickJumper: false,
              }}
              scroll={{ x: "max-content", y: "calc(100vh - 400px)" }}
              size="middle"
              style={{ background: "transparent" }}
              rowKey="key"
            />
          )}
        </TableWrapper>
      </DashboardContainer>
    </ConfigProvider>
  );
};

export default DashboardTable;
