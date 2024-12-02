"use client";

import React, { useState, useEffect } from "react";
import "./UpdownGame.css";

export default function UpdownGame() {
  const [isLoading, setIsLoading] = useState(true);
  const [apiResponse, setApiResponse] = useState(null);
  const [selectedStock, setSelectedStock] = useState(null);
  const [userId, setUserId] = useState(null);
  const [yesterdayPrediction, setYesterdayPrediction] = useState(null);
  const [todayPrediction, setTodayPrediction] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // 실제 애플리케이션에서는 이 부분을 인증 시스템에서 가져와야 합니다.
        setUserId(2);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        setError(
          "사용자 데이터를 가져오는데 실패했습니다. 나중에 다시 시도해주세요."
        );
      }
    };

    const fetchGameStatus = async () => {
      if (!userId) return;

      try {
        const response = await fetch(
          `http://localhost:3001/api/prediction/game-status/${userId}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.success) {
          setYesterdayPrediction(data.data.yesterdayPrediction);
          setTodayPrediction(data.data.todayPrediction);
          setSelectedStock(data.data.randomStock);
        } else {
          throw new Error(
            data.message || "게임 상태를 가져오는데 실패했습니다"
          );
        }
      } catch (error) {
        console.error("Failed to fetch game status:", error);
        setError(
          "게임 상태를 가져오는데 실패했습니다. 나중에 다시 시도해주세요."
        );
      }
    };

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      await fetchUserData();
      await fetchGameStatus();
      setIsLoading(false);
    };

    fetchData();
  }, [userId]);

  const makePrediction = async (prediction) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        "http://localhost:3001/api/predicton/predict",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: userId,
            stockId: selectedStock.stock_id,
            predictionUpOrDown: prediction,
          }),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.success) {
        setApiResponse({
          status: "success",
          message: `${prediction === "UP" ? "상승" : "하락"} 예측이 기록되었습니다.`,
        });
        setTodayPrediction(data.data);
      } else {
        throw new Error(data.message || "예측을 등록하는데 실패했습니다");
      }
    } catch (error) {
      console.error("Failed to make prediction:", error);
      setApiResponse({
        status: "error",
        message: error.message || "예측을 등록하는데 실패했습니다.",
      });
      setError("예측을 하는데 실패했습니다. 나중에 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="loading">로딩 중...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="container">
      <header className="header">
        <h1 className="header-title">쓸방울 모으기</h1>
      </header>

      <main className="main">
        <div className="card">
          <h2 className="card-title">주가예측게임</h2>
          <div className="card-content">
            {yesterdayPrediction && yesterdayPrediction.is_correct !== null && (
              <div className="popup">
                <div className="popup-content">
                  <p>
                    {yesterdayPrediction.is_correct
                      ? "포인트 획득!"
                      : "포인트 획득 실패"}
                  </p>
                  <button onClick={() => setYesterdayPrediction(null)}>
                    닫기
                  </button>
                </div>
              </div>
            )}

            {selectedStock && (
              <div className="stock-info">
                <div className="stock-icon">
                  {selectedStock.symbol.toString().charAt(0)}
                </div>
                <h3 className="stock-name">{selectedStock.name}</h3>
                <p className="stock-price">
                  {new Intl.NumberFormat("ko-KR", {
                    style: "currency",
                    currency: "KRW",
                  }).format(selectedStock.current_price)}
                </p>
              </div>
            )}

            <p className="question">오를까? 내릴까?</p>
            <div className="button-container">
              <button
                onClick={() => makePrediction("UP")}
                disabled={isLoading || !selectedStock || todayPrediction}
                className={`button up-button ${todayPrediction && todayPrediction.prediction_upordown === "UP" ? "selected" : ""}`}
              >
                <span className="arrow-up">▲</span>
                오른다
              </button>
              <button
                onClick={() => makePrediction("DOWN")}
                disabled={isLoading || !selectedStock || todayPrediction}
                className={`button down-button ${todayPrediction && todayPrediction.prediction_upordown === "DOWN" ? "selected" : ""}`}
              >
                <span className="arrow-down">▼</span>
                내린다
              </button>
            </div>

            {apiResponse && (
              <p
                className={`message ${apiResponse.status === "success" ? "success-message" : "error-message"}`}
              >
                {apiResponse.message}
              </p>
            )}
          </div>
        </div>
      </main>

      <footer className="bottomNav">
        <div className="navItems">
          <div className="navItem activeNavItem"></div>
          <div className="navItem"></div>
          <div className="navItem"></div>
          <div className="navItem"></div>
          <div className="navItem"></div>
        </div>
      </footer>
    </div>
  );
}
