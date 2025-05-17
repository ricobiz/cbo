
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

class TimeRange(BaseModel):
    start: datetime
    end: datetime

class AnalyticsRequest(BaseModel):
    time_range: TimeRange
    dimensions: Optional[List[str]] = None
    metrics: List[str]
    filters: Optional[Dict[str, Any]] = None

class MetricData(BaseModel):
    name: str
    value: float
    previous_value: Optional[float] = None
    change_percentage: Optional[float] = None

class TimeSeriesDataPoint(BaseModel):
    timestamp: datetime
    value: float
    
class TimeSeriesMetric(BaseModel):
    name: str
    data: List[TimeSeriesDataPoint]
    
class DistributionItem(BaseModel):
    name: str
    value: float
    percentage: float

class AnalyticsDashboardResponse(BaseModel):
    summary_metrics: List[MetricData]
    time_series_data: List[TimeSeriesMetric]
    distributions: Dict[str, List[DistributionItem]]
