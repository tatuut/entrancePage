import dynamic from 'next/dynamic';
import React, { useState, useEffect, useRef } from 'react';

const SplitFlapDisplay = () => {
  const [isClient, setIsClient] = useState(false);
  const timeRef = useRef(Date.now());
  const ROWS = 45;
  const VISIBLE_ROWS = 30;
  const COLS = 60;
  const targetText = 'LEGAL AGENT';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789{}[]()<>+-*/=_$#@. '.split('');
  
  // 六法の条文スニペット（より詳細なバージョン）
  const lawSnippets = [
    '第一条　私権は、公共の福祉に適合しなければならない。',
    '２　権利の行使及び義務の履行は、信義に従い誠実に行わなければならない。',
    '３　権利の濫用は、これを許さない。',
    '第二条　本法は、個人の尊厳と両性の本質的平等に立脚して、解釈しなければならない。',
    '第三条　法律行為の当事者が意思表示をした時に意思能力を有しなかったときは、その法律行為は、無効とする。',
    '第四条　意思表示は、法令中の公の秩序に関しない規定と異なる意思を表示した場合には、その意思に従う。',
    '第五条　取引の通念に照らして、意思表示の解釈をしなければならない。',
    '第六条　法律行為の無効は、当事者の善意、悪意を問わない。',
    '第七条　公序良俗に反する法律行為は、無効とする。',
    '第八条　代理権を有しない者が他人の代理人としてした契約は、本人がその追認をしない間は、本人に対してその効力を生じない。',
    '第九条　時効は、当事者が援用しなければ、裁判所がこれによって裁判をすることができない。',
    '第十条　裁判所は、当事者の申立てにより、法律行為の効力を判断する。'
  ];

  // プログラミングコードのスニペット（Pythonコード）
  const codeSnippets = [
    'import numpy as np',
    'import tensorflow as tf',
    'from typing import List, Optional',
    'class NeuralNetwork:',
    '    def __init__(self):',
    '        self.model = None',
    '    def build_model(self):',
    '        self.layers = []',
    '        self.optimizer = None',
    '@dataclass',
    'class DataLoader:',
    '    batch_size: int',
    '    shuffle: bool = True',
    'def train_step(model, data):',
    '    with tf.GradientTape() as tape:',
    '        predictions = model(data)',
    '        loss = compute_loss()',
    'async def process_batch():',
    '    await asyncio.sleep(1)',
    'def validate_input(data: dict):',
    '    if not isinstance(data, dict):',
    'class Config(BaseModel):',
    '    api_key: str',
    '    max_retries: int = 3',
    '@pytest.fixture',
    'def test_environment():'
  ];

  // 左端に表示する固定コード（短いバージョン）
  const staticCodeSnippets = [
    'PROGRAM FFT',
    'USE MPI',
    'IMPLICIT NONE',
    '',
    'REAL(8) :: x(1024)',
    'INTEGER :: n, i',
    '',
    'n = 1024',
    'CALL init_fft()',
    '',
    'DO i = 1, n',
    '  x(i) = sin(i)',
    'END DO',
    '',
    'CALL fft(x, n)',
    '',
    'END PROGRAM'
  ];
  
  const targetRow = Math.floor(ROWS / 2);
  const visibleStartRow = Math.max(0, targetRow - Math.floor(VISIBLE_ROWS / 2));  // 表示開始行を中央に合わせる
  const startCol = Math.floor((COLS - targetText.length) / 2);
  const leftCodePosition = -4;  // コードの位置を調整

  useEffect(() => {
    setIsClient(true);
  }, []);

  // 型定義を追加
  type CellState = {
    currentChar: string;
    isActive: boolean;
    hasStarted: boolean;
    cycleSpeed: number;
    lastUpdate: number;
    startDelay: number;
    backgroundColor: string;
    flipCount: number;
    totalFlips: number;
    isHighlighted: boolean;
    finalChar: string;
    textType: 'none' | 'target' | 'code' | 'law';
    glowIntensity: number;
  };

  // Initialize with empty cells
  const [grid, setGrid] = useState<CellState[][]>(() => 
    Array(ROWS).fill(null).map(() => 
      Array(COLS).fill(null).map((): CellState => ({
        currentChar: ' ',
        isActive: false,
        hasStarted: false,
        cycleSpeed: 0,
        lastUpdate: 0,
        startDelay: 0,
        backgroundColor: '#171717',
        flipCount: 0,
        totalFlips: 0,
        isHighlighted: false,
        finalChar: ' ',
        textType: 'none' as const,
        glowIntensity: 0
      }))
    )
  );

  useEffect(() => {
    if (!isClient) return;

    setGrid(Array(ROWS).fill(null).map((_, rowIndex) => 
      Array(COLS).fill(null).map((_, colIndex): CellState => {
        const maxFlips = Math.floor(4 + Math.random() * 8);
        const isTargetRow = rowIndex === targetRow;
        const isInTargetText = isTargetRow && colIndex >= startCol && colIndex < startCol + targetText.length;

        let finalChar = ' ';
        let textType: CellState['textType'] = 'none';
        let startDelay = 0;

        if (isInTargetText) {
          finalChar = targetText[colIndex - startCol];
          textType = 'target';
          startDelay = colIndex * 30 + 1000;  // 1秒遅延を追加
        } else {
          // コードと法文の両方を配置可能にする
          const shouldShowCode = Math.random() > 0.5;
          
          // Pythonコードの流れ（左上から左下、そして右へ）
          const codeRow = Math.floor(rowIndex + colIndex / 8);
          const isInCodeRange = codeRow < ROWS && colIndex < COLS * 1.5;
          
          // 法文の流れ（右上から左上、そして下へ）
          const lawRow = Math.floor(rowIndex + (COLS - colIndex) / 6);
          const isInLawRange = lawRow < ROWS * 1.5 && colIndex >= 0;

          if (shouldShowCode && isInCodeRange) {
            // コードの連続性を保持
            const codeLineIndex = rowIndex % codeSnippets.length;
            const codeLine = codeSnippets[codeLineIndex];
            const codeCharIndex = colIndex % codeLine.length;
            
            if (codeCharIndex < codeLine.length) {
              finalChar = codeLine[codeCharIndex];
              textType = 'code';
              startDelay = Math.random() * 100 + codeRow * 25 + colIndex * 35;
            }
          } else if (!shouldShowCode && isInLawRange) {
            // 法文の連続性を保持
            const lawLineIndex = colIndex % lawSnippets.length;
            const lawLine = lawSnippets[lawLineIndex];
            const lawCharIndex = rowIndex % lawLine.length;
            
            if (lawCharIndex < lawLine.length) {
              finalChar = lawLine[lawCharIndex];
              textType = 'law';
              startDelay = Math.random() * 150 + (COLS - colIndex) * 20 + lawRow * 40;
            }
          }

          // 7秒後にすべての文字を消す
          if (finalChar !== ' ') {
            startDelay = Math.min(startDelay, 7000 - Math.random() * 1000);  // 6-7秒の間にランダムに消える
          }
        }

        // 初期表示を完全に空にする
        if (startDelay < 100) {
          finalChar = ' ';
          textType = 'none';
        }

        return {
          currentChar: ' ',
          isActive: false,
          hasStarted: false,
          cycleSpeed: 5 + Math.random() * 10,
          lastUpdate: 0,
          startDelay,
          backgroundColor: '#171717',
          flipCount: 0,
          totalFlips: maxFlips,
          isHighlighted: false,
          finalChar: isInTargetText ? finalChar : ' ',
          textType,
          glowIntensity: 0
        };
      })
    ));
  }, [isClient]);

  useEffect(() => {
    if (!isClient) return;

    let frameId;
    let startTime = Date.now();

    const animate = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;

      // 7秒経過後はアニメーションを停止
      if (elapsed > 8400) {  // 7400から8400に変更
        cancelAnimationFrame(frameId);
        return;
      }

      setGrid(prevGrid => {
        return prevGrid.map((row, rowIndex) => 
          row.map((cell, colIndex) => {
            // 動的な背景色の計算
            const baseColor = 23;
            const time = currentTime * 0.001;
            const xFreq = (rowIndex * COLS + colIndex) * 0.1;
            const yFreq = (colIndex * ROWS + rowIndex) * 0.08;
            const waveTime = elapsed > 7000 ? Date.now() * 0.001 : time;
            const baseWave1 = Math.sin(waveTime + xFreq) * 4;
            const baseWave2 = Math.cos(waveTime * 0.7 + yFreq) * 3;
            const baseWave3 = Math.sin((waveTime * 0.5 + xFreq + yFreq) * 0.5) * 3;
            const baseWave4 = Math.cos(waveTime * 0.3 - (xFreq * yFreq) * 0.01) * 2;
            const baseWave5 = Math.sin(waveTime * 0.2 + Math.sqrt(xFreq * xFreq + yFreq * yFreq)) * 2;

            // LEGAL AGENTの確定時の波動効果
            let rippleEffect = 0;
            let rippleGold = 0;
            let rippleRed = 0;
            const targetCenterCol = startCol + Math.floor(targetText.length / 2);
            const targetCenterRow = targetRow;
            
            if (elapsed > 7200 && elapsed < 7700) {  // 6200から7200に変更
              const distanceFromCenter = Math.sqrt(
                Math.pow(rowIndex - targetCenterRow, 2) + 
                Math.pow(colIndex - targetCenterCol, 2)
              );
              const rippleTime = (elapsed - 7200) / 500;  // 6200から7200に変更
              const rippleRadius = rippleTime * Math.max(ROWS, COLS);
              const rippleWidth = 8;  // 波の幅を広げる
              const rippleIntensity = Math.exp(-Math.pow(distanceFromCenter - rippleRadius, 2) / rippleWidth);
              const secondaryRipple = Math.exp(-Math.pow(distanceFromCenter - rippleRadius * 0.7, 2) / rippleWidth) * 0.7;
              const tertiaryRipple = Math.exp(-Math.pow(distanceFromCenter - rippleRadius * 0.4, 2) / rippleWidth) * 0.4;
              
              // 波の強度を大幅に増加
              rippleEffect = (rippleIntensity + secondaryRipple + tertiaryRipple) * 40;
              // より強い金色の効果
              rippleGold = rippleEffect * 1.2;  // 黄色の成分を増加
              rippleRed = rippleEffect * 0.8;   // 赤の成分を追加
            }

            const colorNoise = baseColor + baseWave1 + baseWave2 + baseWave3 + baseWave4 + baseWave5 + rippleEffect;
            const dynamicBgColor = `rgb(${colorNoise + rippleRed + rippleGold}, ${colorNoise + rippleGold}, ${colorNoise})`;

            if (elapsed < cell.startDelay) {
              return cell;
            }

            if (!cell.hasStarted) {
              return {
                ...cell,
                isActive: true,
                hasStarted: true,
                lastUpdate: currentTime
              };
            }

            const isTargetCell = rowIndex === targetRow &&
                               colIndex >= startCol &&
                               colIndex < startCol + targetText.length;

            // 確定直前の光るエフェクト
            const isAboutToSettle = cell.flipCount >= cell.totalFlips - 2;
            const glowIntensity = isTargetCell && isAboutToSettle ? 
              Math.sin((currentTime - cell.lastUpdate) * 0.01) * 30 + 40 : 0;

            if (cell.flipCount >= cell.totalFlips) {
              return {
                ...cell,
                isActive: false,
                currentChar: cell.finalChar,
                isHighlighted: isTargetCell,
                backgroundColor: dynamicBgColor,
                glowIntensity: 0
              };
            }

            if (cell.isActive && (currentTime - cell.lastUpdate > cell.cycleSpeed)) {
              const nextCharIndex = Math.floor(Math.random() * characters.length);
              return {
                ...cell,
                currentChar: characters[nextCharIndex],
                lastUpdate: currentTime,
                flipCount: cell.flipCount + 1,
                cycleSpeed: cell.cycleSpeed * (1 + (cell.flipCount / cell.totalFlips) * 0.1),
                backgroundColor: dynamicBgColor,
                glowIntensity
              };
            }

            return {
              ...cell,
              backgroundColor: dynamicBgColor,
              glowIntensity
            };
          })
        );
      });

      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [isClient]);

  // アニメーション終了後も背景の揺らぎを継続
  useEffect(() => {
    if (!isClient) return;

    let frameId;
    const animate = () => {
      timeRef.current = Date.now();
      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [isClient]);

  useEffect(() => {
    const interval = setInterval(() => {
      timeRef.current = Date.now();
    }, 16);
    return () => clearInterval(interval);
  }, []);

  if (!isClient) {
    return <div className="bg-black p-2 rounded-lg shadow-lg overflow-auto min-h-[600px] min-w-[600px]" />;
  }

  return (
    <div className="bg-black p-2 rounded-lg shadow-lg overflow-hidden">
      <div className="flex flex-col gap-0">
        {grid.slice(visibleStartRow, visibleStartRow + VISIBLE_ROWS).map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-start gap-0 whitespace-pre">
            {row.map((cell, colIndex) => {
              const actualRowIndex = rowIndex + visibleStartRow;  // 実際の行インデックスを計算
              const isTargetCell = actualRowIndex === targetRow &&
                                 colIndex >= startCol &&
                                 colIndex < startCol + targetText.length;
              const isFinished = !cell.isActive;

              // 動的な背景色の計算
              const baseColor = 23;
              const time = Date.now() * 0.001;
              const xFreq = (actualRowIndex * COLS + colIndex) * 0.1;
              const yFreq = (colIndex * ROWS + actualRowIndex) * 0.08;
              const waveTime = time;
              const baseWave1 = Math.sin(waveTime + xFreq) * 4;
              const baseWave2 = Math.cos(waveTime * 0.7 + yFreq) * 3;
              const baseWave3 = Math.sin((waveTime * 0.5 + xFreq + yFreq) * 0.5) * 3;
              const baseWave4 = Math.cos(waveTime * 0.3 - (xFreq * yFreq) * 0.01) * 2;
              const baseWave5 = Math.sin(waveTime * 0.2 + Math.sqrt(xFreq * xFreq + yFreq * yFreq)) * 2;
              const renderColorNoise = baseColor + baseWave1 + baseWave2 + baseWave3 + baseWave4 + baseWave5;

              // 金色の波動効果を維持
              let renderRippleGold = 0;
              let renderRippleRed = 0;
              if (cell.textType === 'target' && cell.isHighlighted) {
                const distanceFromCenter = Math.sqrt(
                  Math.pow(actualRowIndex - targetRow, 2) + 
                  Math.pow(colIndex - (startCol + targetText.length / 2), 2)
                );
                // より強い残存波動効果
                renderRippleGold = Math.exp(-distanceFromCenter * 0.08) * 35;  // 強度と減衰率を調整
                renderRippleRed = renderRippleGold * 0.6;  // 赤成分を追加
              }

              const renderBgColor = `rgb(${renderColorNoise + renderRippleRed + renderRippleGold}, ${renderColorNoise + renderRippleGold}, ${renderColorNoise})`;

              // テキストタイプと状態に基づいて色を決定
              let textColor = '#4ade80';  // デフォルトの緑色
              if (cell.textType === 'target' && cell.isHighlighted) {
                const glowAmount = cell.glowIntensity || 0;
                textColor = `rgb(255, ${191 + glowAmount}, ${36 + glowAmount * 0.5})`;  // より金色に近い光り方
              } else if (cell.textType === 'law') {
                textColor = '#9ca3af';
              }

              return (
                <div
                  key={`${actualRowIndex}-${colIndex}`}
                  className="relative"
                >
                  <div
                    className={`w-5 h-5 flex items-center justify-center
                              border-b-[1.3px] border-l-[1.3px] border-r-[1.3px] border-neutral-800/70
                              transition-all duration-50 text-xs
                              ${cell.isActive ? 'transform-gpu' : ''}`}
                    style={{ 
                      fontFamily: 'Consolas, monospace',
                      fontWeight: '600',
                      backgroundColor: renderBgColor,
                      color: textColor,
                      transform: cell.isActive ? `rotateX(${(timeRef.current - cell.lastUpdate) / cell.cycleSpeed * 180}deg)` : 'none',
                      textShadow: cell.glowIntensity ? `0 0 ${cell.glowIntensity * 1.5}px rgba(255, 191, 36, 0.9)` : 'none'  // より強い光沢
                    }}
                  >
                    {cell.currentChar}
                    <div className="absolute top-0 left-0 w-full h-[1.3px] bg-neutral-800/70" />
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
      
      {/* モダンなリンクセクション */}
      <div className="mt-4 flex justify-center gap-8">
        <a
          href="https://www.legalagent.co.jp/"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative px-6 py-2 bg-transparent overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-yellow-500/5 transform group-hover:scale-105 transition-transform duration-500" />
          <div className="absolute inset-0 border border-neutral-800/50 group-hover:border-yellow-500/30 transition-colors duration-500" />
          <span className="relative text-neutral-400 group-hover:text-yellow-500 transition-colors duration-300 text-xs tracking-wider">
            LEGAL OFFICE
          </span>
        </a>

        <a
          href="https://www.legalagent.co.jp/"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative px-6 py-2 bg-transparent overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-blue-500/5 transform group-hover:scale-105 transition-transform duration-500" />
          <div className="absolute inset-0 border border-neutral-800/50 group-hover:border-blue-500/30 transition-colors duration-500" />
          <span className="relative text-neutral-400 group-hover:text-blue-500 transition-colors duration-300 text-xs tracking-wider">
            CORPORATION
          </span>
        </a>
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(SplitFlapDisplay), {
  ssr: false
});

