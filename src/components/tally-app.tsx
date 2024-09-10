'use client'

import React, { useState, useEffect, FormEvent } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const STROKE_COLORS = ['#FF0000', '#00FF00', '#0000FF', '#FFA500', '#800080']

export function TallyApp() {
  const [tally, setTally] = useState(0)
  const [memo, setMemo] = useState('')
  const [history, setHistory] = useState<{ stroke: number; memo: string }[]>([])
  const [showCake, setShowCake] = useState(false)

  useEffect(() => {
    const fetchHistory = async () => {
      const response = await fetch('/api/tally');
      const data = await response.json();
      if (Array.isArray(data)) {
        setHistory(data);
        if (data.length > 0) {
          setTally(data[data.length - 1].stroke);
        }
      } else {
        console.error('データが配列ではありません:', data);
      }
    };

    fetchHistory();
  }, []);

  const addStroke = async (newStroke, memo) => {
    try {
      const response = await fetch('/api/tally', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ stroke: newStroke, memo }),
      });

      if (!response.ok) {
        throw new Error('データの作成に失敗しました');
      }

      const data = await response.json();
      setHistory((prevHistory) => [...prevHistory, data]);
      setTally(newStroke);
      setMemo('');
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    addStroke(tally + 1, memo)
  }

  useEffect(() => {
    if (showCake) {
      const timer = setTimeout(() => setShowCake(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [showCake])

  const renderTally = () => {
    return (
      <div className="flex flex-wrap gap-2">
        {[...Array(Math.floor(tally / 5))].map((_, groupIndex) => (
          <div key={groupIndex} className="flex">
            {[...Array(5)].map((_, index) => (
              <div
                key={index}
                className="w-4 h-16 mr-1"
                style={{ backgroundColor: STROKE_COLORS[index] }}
              />
            ))}
          </div>
        ))}
        <div className="flex">
          {[...Array(tally % 5)].map((_, index) => (
            <div
              key={index}
              className="w-4 h-16 mr-1"
              style={{ backgroundColor: STROKE_COLORS[index] }}
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-4 text-center">カウンター</h1>
      <Card className="mb-4">
        <CardContent className="p-4">
          {renderTally()}
          <div className="text-2xl font-bold mt-4 text-center">合計: {tally}</div>
          <form onSubmit={handleSubmit} className="flex gap-2 mt-4">
            <Input
              type="text"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="メモを入力"
              className="flex-grow"
              aria-label="メモ入力"
            />
            <Button type="submit">追加</Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <h2 className="text-xl font-bold mb-2">履歴</h2>
          <ul className="space-y-2">
            {history.map((item, index) => (
              <li key={index} className="flex items-center gap-2">
                <span className="font-mono text-lg">#{item.stroke}</span>
                <span>{item.memo}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      {showCake && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300" aria-live="polite" aria-atomic="true">
          <div className="text-6xl animate-bounce" role="img" aria-label="お祝いのケーキ">🎂</div>
        </div>
      )}
      <style jsx>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-bounce {
          animation: bounce 0.5s infinite;
        }
      `}</style>
    </div>
  )
}