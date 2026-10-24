---
title: "[논문 리뷰] AI and TCAD for Inverse Design and Defect Discovery: From Simple Machine Learning to LLM"
date: 2026-10-24
media_type: 논문
description: "논문 리뷰"
published: true
---

부장님이 추천해주신 논문을 읽어봤습니다.

논문을 읽을 때는 Abstract와 INTRODUCTION, CONCLUSIONS를 먼저 읽으라고 배웠기 때문에 GPT의 도움을 받아서 읽고 정리해보겠습니다.

### Abstract

AI는 다양한 공학 분야를 혁신했지만, 제한된 데이터와 차원의 저주 때문에 반도체 소자 설계 및 결함 발견에 미친 영향은 아직 제한적임
본 논문은 TCAD\*로 ML에 필요한 정밀한 데이터를 생성하는 **Simulation-Augmented ML** 연구를 논의함

\*TCAD: Technology Computer-Aided Design

최소한의 domain expertise만으로도 특정 작업에서 소자 엔지니어 수준의 성능을 내는 모델을 구축할 수 있음
TCAD 데이터에 Autoencoder 기반 모델과 Noise Engineering을 적용하면 latent physics를 효과적으로 학습하고 실험 데이터에도 적용할 수 있음

여러 반도체 소자의 특성을 추정 및 역추정, 예측하는 사례를 다루고, LLM과 MLLM의 활용 사례 및 도입 가능성을 논의함

### I. INTRODUCTION

ML은 다양한 분야에 활용되고 있지만, 반도체 device physics와 defect 분야에서는 데이터가 부족함
그 이유는 아래와 같음

1. 첨단 semiconductor technology node의 보안성이 매우 높아 공개 데이터가 부족함
2. 기술이 개발 단계에서 성숙 단계로 발전하면 결함 데이터의 수가 줄어들음
3. 결함과 전기적 특성 사이의 물리적 관계를 완전히 학습하기 위해 필요한 3D tomography 데이터의 확보가 불가능에 가까움

이런 한계는 TCAD 및 SPICE simulation 데이터 생성으로 극복 가능함
이를 TCAD-Augmented ML 또는 Simulation-Augmended ML이라고 함
본 논문은 반도체 inverse design, defect identification 및 응용 사례를 검토하고 ML 수준을 인간의 학습 단계에 비유함

### VII. CONCLUSIONS

전통 ML 모델을 이용한 반도체 defect discovery 및 reverse engineering 연구를 검토함
TCAD와 simulation data로 electrical characteristics와 device parameter의 상관관계를 학습하여 domain expertise 의존 없이 모델을 구축할 수 있음을 강조함

Noise Engineering 및 Autoencoder 같은 Manifold Learning을 이용하면 모델이 Underlying physics를 학습하고 overfitting을 줄이며, noise와 설명되지 않은 물리 현상이 존재해도 실제 실험 데이터에 적용 가능함
LLM과 MLLM은 전통 ML의 어려움을 완화하고 반도체 AI 응용을 확대할 것으로 예상함
이를 위해서는 TCAD simulation으로 생성할 수 있는 3D tomography semiconductor database가 필요함

> 전체적인 내용은 파악을 했으니, 세부적으로 읽어보겠습니다

### II. INITIAL ATTEMPT OF TCAD-AUGMENTED ML

TCAD-Augmented ML은 TCAD가 생성한 데이터로 상관관계가 있는 두 parameter 집합의 관계를 모델이 학습하도록 함
일반적으로 IV·CV 같은 electrical characteristics와 structural parameter 간 관계를 다룸

PiN diode의 IV는 p-type, intrinsic, n-type 영역의 두께 및 doping과 관련됨
TCAD로 여러 구조와 IV를 생성하고 학습 데이터로 사용함
2019년 SISPAD에서 제안한 비파괴적인 Reverse Engineering은 공정 variation과 defect를 발견하는 데 유용함
IV로부터 thickness 및 doping을 추정하며, 간단한 Linear Regression으로도 학습에 쓰지 않은 TCAD IV의 구조 parameter를 잘 추정함

### III. OVER-FITTING AND ITS ALLEVIATIONS

TCAD 데이터에서 높은 정확도를 달성한 모델이 실험 데이터에는 실패할 수 있음

#### 사례 1: Ga₂O₃ SBD 측정 IV

문헌과 실험 curve로 temperature-dependent TCAD parameter를 calibration한 뒤 Polynomial Regression 모델을 구축했지만 실험 IV에 대한 예측은 실패함

#### 사례 2: PiN Diode

두께 변화로만 학습한 모델을 doping variation을 가진 Set에 적용하면 음수 두께 같은 비현실적 값 발생함
이는 simulation 데이터에 과적합된 결과임

이러한 과적합을 해결하기 위한 방법들을 제시함

### III-A. Principal Components Analysis(PCA)

실제 실험에는 simulation이 고려 못한 noise와 hidden physics(예: defect)가 있음
모델은 보지 못한 현상을 해석하려다 현실 물리 세계에서 벗어난 parameter를 예측함

IV 데이터로부터 네 개의 Principal Component를 추출한 다음 regression하도록 하니 원치 않는 noise와 모델링되지 않은 물리 효과의 영향을 줄이고 parameter를 예상 범위에서 예측함
IV의 변화가 네가지 parameter에 의해 유도된다는 domain knowledge를 주입한 것임

### III-B. Noise Engineering

TCAD 데이터에 noise를 주입함
모델이 각 IV point의 수치를 단순 암기할 수 없게하여 보다 일반적인 feature를 추출하도록 함
SNR 7dB의 noise를 이용하면 간단한 Polynomial Regression만으로도 PCA 없이 현실적인 ambient temperature 범위를 예측할 수 있음
절대 온도값은 정확하지 않더라도 실험의 상대적인 온도 범위를 재현했으며, PiN diode의 비현실적인 thickness 예측도 방지함

### III-C. Autoencoder

모델이 underlying physics까지 학습하게 하고자 함
Domain expertise를 사용하려면 전문가와 시간이 필요함

Autoencoder(AE)를 사용하면 물리 관계를 모델 스스로 latent physics로 표현할 수 있음
AE는 입력과 출력을 같게 reconstruction하면서 중간 hidden layer의 node 수를 줄여 작은 latent space에 정보를 encoding함
Latent dimension은 structural parameter 수에 맞출 수 있으나 latent variable과 parameter가 일대일 대응하는 것은 아님

Ga₂O₃ SBD 사례에서 52 point의 IV를 2차원 latent vector로 encoding하고, Linear Regression으로 workfunction과 temperature에 연결함
실험 IV를 AE에 넣어 latent vector를 구하고 regressor로 parameter를 예측함
Domain expertise를 사용하지 않은 모델(WoDE)도 전문가 feature를 사용한 모델(WED)과 비슷한 성능을 보임
단순 noise 추가보다 예측이 정확함

### IV.AE-BASED MODEL

AE 기반 모델은 최소한의 domain expertise로 underlying physics를 학습하여 Simulation-Augmented ML의 활용 범위를 넓힘
이 챕터에서는 circuit simulation, IV prediction, inverse design, automatic calibration을 다룸
ML 관점에서 circuit defect, device image 및 physics parameter는 모두 electrical characteristics와 연결되는 structural parameter임

### IV-A. Simulation-Augmented ML using SPICE

Inverter의 Voltage-Transfer-Characteristic(VTC)을 측정하면 transistor fabrication, contact opening, metallization을 확인할 수 있음

저자들은 SPICE simulation 데이터를 이용해 VTC만으로 NMOS와 PMOS drain contact resistance를 추정함
80-50-2-50-80 node의 5개 hidden layer를 사용하고 51 point VTC를 latent variable h₀, h₁로 encoding함
KNN(k=3)으로 두 변수를 R₀, R₁과 연결함
PMOS 개수가 1, 2, 3으로 달라도 latent relation이 유사한 패턴을 보여 underlysing physics를 학습했음을 시사함

### IV-B. Surrogate Model for Advanced Devices

수정된 AE는 structural parameter에서 IV 또는 CV curve를 예측하는 Forward Surrogate Model로도 활용됨
FinFET의 세 가지 structural parameter를 변화시켜 IV/CV를 학습함
AE는 curve reconstruction error를 줄이고 3개 hidden variable을 3차 Polynomial Regression으로 structural parameter와 연결함

Training sample이 25개인 AE25도 ION, IOFF, gm, DIBL, SS, CV를 예측할 수 있었으며, Linear 및 saturation IV를 따로 학습했음에도 DIBL을 잘 예측함
Stress variation을 추가한 AE50SD도 좋은 성능을 보임
물리가 충분히 확립되지 않은 신기술에서도 예측 가능성을 보여줌

서로 다른 조건에서 생성한 IV, CV의 특성을 AE latent representation으로 표현하고 decoder를 통해 curve를 생성함
Model의 성능은 device metric을 추출해 검증함
알려지지 않은 stress variation을 추가한 데이터에 대해서도 높은 예측 성능이 유지되므로 현실 실험의 모델링되지 않은 물리 변화에 대응 가능함

### IV-C. Correlating Images to Electrical Characteristics

Domain expertise 의존을 더 줄이기 위해 명시적 structural parameter 추출 없이 device image와 electical characteristics 사이의 상관관계를 학습함
Image-VAE, Curve-VAE, 3차 Polynomial Regressor를 결합함

모델은 다섯 가지 structural parameter variation을 지닌 transistor image와 해당 IV curve로 학습함
VAE는 recontruction loss 최소화하고, latent distriution을 regularization함
두 VAE의 latent space를 Polynomial Regressor로 연결하여 image에서 IV curve를 생성하거나 IV에서 소자 구조를 추정할 수 있음

Training distribution과 차이가 있는 image에서도 TCAD 구조의 IV와 비슷한 curve를 예측함
반대 방향에서도 IV를 재현하는 device image를 생성함
모델이 noise에 robust하며 전기 특성에 영향이 작은 parameter에 크게 혼동되지 않음을 보여줌

### IV-D. Automatic TCAD PArameter Calibration and PINN

AE가 domain expertise 없이 inverse design을 수행했다는 것은 underlying physics를 어느 정도 학습했을 수 있음을 시사함
이를 활용해 Ga₂O₃ Philips Unified Mobility Model(PhuMob)의 parameter 자동 calibration을 수행함

#### 연구 1

PhuMob의 6개 parameter를 변화시켜 20,000개 SBD IV curve를 생성해 AE 및 일반 NN으로 학습
Latent space는 10차원으로 두어 global minimum을 빠르게 탐색하게 하고 training curve에 noise를 부여함
모델이 추출한 parameter로 다시 TCAD simulation을 수행했을 때 원하는 IV가 잘 재현됨

#### 연구 2

후속 연구로 parameter를 7개로 늘림
일부 예측이 물리적으로 허용되지 않는 mobility parameter 관계를 위반하는 문제를 발견함
해결하기 위해 physical loss를 NN training에 반영한 간단한 Physics-Informed Neural Network(PINN)를 사용함
공통 PhuMob parameter를 추출해 simulation curve를 재현했음
AE-PINN은 AE-NN보다 좋고, 10년 경험을 가진 엔지니어가 수십 시간 수행한 manual calibration과 유사함

### IV-E. Device Optimization through Surrogate Models

Surrogate Model을 optimizer와 결합하면 device 또는 system의 inverse design을 수행할 수 있음
GaN diode에서는 guard ring parameter와 성능의 forward correlation을 NN으로 학습하고 NAGA-II optimizer로 Breakdown Voltage(BV)과 (VFQ)^(-1) 사이의 trade-off에 적합한 구조를 탐색함
266개의 비최적 구조를 TCAD로 생성해 surrogate 학습에 사용한 뒤 Pareto front를 탐색함

### V. LIMITATIONS OF TRADITIONAL ML

#### 첫째

새로운 문제마다 모델을 다시 학습해야하며 경우에 따라 물리적으로 불가능한 결과를 방지하려면 domain expertise가 필요함

#### 둘째

Training 데이터 생성량이 큼
각 parameter에 최소 3개 값이 필요하다고 보면 N개 parameter에 약 3^N개의 데이터가 필요함
Latin Hypercube 기법으로 완화할 수 있음

#### 셋째

BV 등 일부 simulation은 느리고 convergence rate가 낮음
빠르고 정확한 간소화된 simulation 기법은 throughput을 5배 높였지만 전문가의 calibration이 필요했음

#### 넷째

차원의 저주로 parameter가 많아질수록 성능이 저하됨

#### 다섯째

Underlying physics를 어느정도 학습해도 training range를 넘는 외삽에는 한계가 있음
GAN의 확장 예에서는 training volume 대비 3.7-4.6배까지만 예측함

#### 여섯째

대부분의 surrogate는 고정 bias에서만 예측할 수 있음
Conditional VAE(CVAE)는 이러한 bias condition variable로 입력해 bias 사이를 매끄럽게 interpolation함

### VI. LARGE LANGUAGE MODEL(LLM)

반도체 데이터로 fine-tuning한 LLM은 언급한 문제를 일부 완화할 수 있음
LLM은 이미 domain expertise와 reasoning 능력을 갖고 있으며 고차원 문제의 다양한 smoothing·interpolation에 활용될 잠재력이 있음

Multimodal LLM(MLLM)은 특히 중요함
Device physics의 전계·carrier density 공간 분포와 circuit topology가 동작을 결정하기 때문임
실험으로 얻기 어려운 3D tomography를 확보하려면 TCAD 기반의 반도체 DB가 필요함

LLM으로 TCAD simulation의 input file도 만들 수 있음
Llama 2, Llama 3을 fine-tuning하여 18개 parameter의 nanowire 구조를 자연어 지시로 생성하는 chatbot을 구축했고 nanowire 구조 - Sentaurus Structure Editor(SSE) input file 데이터 쌍을 7,000개 생성함

LLM의 성능이 향상됨에 따라 fine-tuning 없이도 LLM이 이러한 지시를 잘 처리하게 됨

MLLM은 semiconductor defect discovery 및 reverse engineering의 핵심 역할을 할 수 있음
연구팀은 transistor 구조 이미지와 gate length, oxide thickness, spacer width 등 parameter를 쌍으로 구성해 Qwen2.5-VL에 LoRA와 full fine-tuning을 적용함
이미지에 별도의 annotation이 없어도 fine-tuned Qwen은 그림과 parameter를 연결하고 학습에 없던 image의 치수를 측정할 수 있었음
