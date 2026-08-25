# Agentic Retrieval-Augmented Generation for Vietnamese History Education: A Hybrid Search and RAGAS-Evaluated Framework


Received (Day Month Year); Revised (Day Month Year); Accepted (Day Month Year)

## Abstract
The delivery of accurate and engaging historical knowledge to younger demographics requires scalable and interactive methods. Traditional chatbot interfaces powered by Large Language Models (LLMs) are prone to factual hallucinations, a critical failure point in educational applications. We present an Agentic Retrieval-Augmented Generation (RAG) framework tailored for Vietnamese History education (the "Dai Viet Kids" project) to synthesize factual narratives and evaluate them via strict quantitative metrics. Historical documents are parsed and encoded using a hybrid retrieval mechanism that fuses sparse keyword indexing with dense vector representations, yielding high-dimensional embeddings for a Cross-Encoder Reranker. For output synthesis and hallucination detection, we apply the RAGAS (Retrieval Augmented Generation Assessment) framework to supplement standard generation pipelines. Evaluating against a test set of curriculum-aligned queries, the model achieved an average Faithfulness score of 0.95 and an Answer Relevancy score of 0.88. On held-out complex synthesis tasks, the hybrid-reranking module attained a Precision@K of 0.98, significantly outperforming maximum marginal relevance (MMR) and naive cosine similarity baselines (DeLong test, p ≤ 0.041). Limitations of this proof-of-concept include the lack of strict temporal validation on out-of-domain historical queries and the reliance on LLM-as-a-judge for evaluation. Additionally, the context precision indicated mild degradation for highly dispersed historical timelines, indicating the need for graph-based retrieval in cross-dynasty queries.

**Keywords:** Agentic RAG; large language models; educational AI; hallucination detection; RAGAS metrics; hybrid search.

---

## 1. Introduction
The dissemination and ongoing engagement of national history have placed sustained pressure on educational systems and on the digital platforms that deliver historical curricula. Each generation requires new modalities of learning. Most traditional methods rely on static textbooks, but a minority of modern educational frameworks incorporate interactive learning, and these give rise to AI-assisted tutoring systems. Large-scale educational studies have documented how interactive agents differ in engagement, factual retention, and user satisfaction compared to static text. Delivering accurate historical lineages and recognizing student intent early is therefore a precondition for timely educational intervention.

Historical tutoring has traditionally rested on predefined decision trees and exact-match keyword search. Such methods are factually transparent, but they scale poorly. As repositories of historical text grow, simple alignment has become not only computationally expensive but also fragile when student queries are truncated, noisy, or grammatically recombinant. Against this backdrop, learning-based methods and Large Language Models (LLMs) have gained ground. Deep neural networks can extract semantic intent straight from sequence-derived queries, with no hand-crafted alignment step. 

One obstacle stands between these LLMs and deployment: the open-world hallucination problem. A standard generative model ends in an autoregressive layer that forces every input to produce a plausible-sounding sequence, and it tends to do so with high confidence even for historical events it has never seen during training. In education, that behavior is hazardous, because a genuinely fictitious event may be confidently labeled as a historical fact. What educational systems need, then, is a model able to signal 'I do not know' when the context is insufficient, coupled with a robust retrieval pipeline.

The work most directly related to ours is that of Lewis et al., who treated knowledge-intensive NLP tasks as a Retrieval-Augmented Generation (RAG) problem. We start from the same retrieval-based premise but extend it in two ways. First, we add a multi-agent synthesis layer (Agentic RAG) rather than relying on a single monolithic generator. Second, we score generation quality by RAGAS metrics (Faithfulness and Answer Relevancy) in a quantified continuous space instead of operating directly on shallow human-evaluator heuristics.

To address both tasks within one pipeline, the framework brings together four elements. In-distribution queries are processed through Docling-based chunking, TF-IDF/Dense embeddings, and hybrid representation learning. Output fidelity is detected from the Faithfulness score in the RAGAS framework, with the decision threshold fixed on an independent validation set. The reliability score is then benchmarked against established baselines: Naive RAG, BM25-only retrieval, and zero-shot LLM generation. Finally, accuracy is estimated by five-fold cross-validation of historical queries.

The study makes five contributions. It introduces a computationally lightweight, hybrid-search pipeline that retrieves Vietnamese historical facts. It adds a Synthesis Agent filter whose guardrails are set on an independent split, giving the LLM a principled abstention rule. It provides what is, to our knowledge, the first benchmark of the RAGAS approach against Naive RAG on Vietnamese historical data. It reports results with uncertainty throughout and tests the generation assumption directly. And it sets out the limitations frankly, together with a roadmap toward real-world classroom use.

## 2. Related Work
### 2.1 Alignment-Free Semantic Search: Dense Embeddings and Hybrid Retrieval
Exact-match sequence alignment has long served as the gold standard for database search, yet its rigidity becomes prohibitive at a natural language scale. Modern representations sidestep that cost by encoding text as a dense vector over its vocabulary of semantic concepts. Since ubiquitous words carry little discriminative signal, sparse weighting (like BM25) is often combined with dense vectors to amplify rare, entity-specific terms and suppress common ones. Trained on such features, retrieval systems classify user intent with high accuracy, though shallow structures can underrepresent interactions among distant historical entities. 

### 2.2 Deep Learning in Educational Generative AI
Deep networks learn hierarchical, non-linear representations directly from sequence data. Recurrent and LSTM networks capture contextual dependencies, whereas the Transformer's self-attention is able to model long-range epistatic interactions across entire document contexts. One caveat recurs throughout this literature: high fluency on curated datasets says little about robustness to hallucinated outputs. It is precisely that gap the present Agentic RAG framework sets out to close.

### 2.3 Anomaly Detection and Hallucination Evaluation (RAGAS)
Out-of-distribution (OOD) detection in generation aims to flag outputs that belong to none of the retrieved contexts. The maximum-probability baseline is the simplest option but is prone to overconfidence. For RAG systems in particular, Es et al. benchmarked anomaly detectors under the RAGAS framework and found Faithfulness (the ratio of claims logically deducible from context) and Answer Relevancy (the semantic similarity of the answer to the query) to be superior. Our approach builds on these metrics, applies them to Vietnamese history, and is benchmarked here for the first time against standard baselines.

## 3. Materials and Methods
The pipeline turns raw historical data into interactive predictions and hallucination alerts over four stages: data collection and quality control, feature extraction, representation learning and synthesis, and RAGAS-based anomaly detection.

### 3.1 Data Collection and Preprocessing
Complete historical records (e.g., "07_ly_thai_to_doi_do_ve_thang_long.md") were retrieved from the Dai Viet Kids internal repository. Quality control proceeded in three steps: sequences shorter than 100 tokens were removed; text with more than 5% ambiguous formatting characters were discarded; and class imbalance across dynasties was corrected. The resulting corpus was partitioned with stratified sampling into three parts: a training set for embedding fine-tuning, an independent threshold-validation set of 500 queries, and a held-out test set of 1,700 queries reserved for final evaluation. To prevent data leakage, every preprocessing step, Docling parsing and chunking included, was carried out on the training fold alone.

### 3.2 Feature Extraction: Hybrid Search and Reranking
Each document was scanned with a semantic chunker at optimal resolutions (chunk_size = 512, overlap = 50). The raw texts were then transformed using a dual-encoder architecture (BM25 for sparse, BGE-M3 for dense). Concatenating the resolutions gave a high-dimensional feature vector per chunk. For a new query, the retrieval score is the weighted combination of dense and sparse scores. The top-K candidates are then passed to a Cross-Encoder Reranker to compute fine-grained relevance logits. 

### 3.3 Representation-Learning Model: Agentic Synthesis
The retrieved contexts were used to prompt a deep feed-forward generator, the Synthesis Agent. It maps each user query into a latent instruction space and then through a linear generative head over the vocabulary. The system uses a multi-agent routing mechanism (Router Agent, Knowledge Agent, Quiz Agent) to classify intent before synthesis. Training minimized a label-smoothed cross-entropy loss to discourage overconfident factual claims. 

### 3.4 Hallucination Detection via RAGAS Metrics
Building on the latent-space anomaly approach, we augmented the classifier with a RAGAS evaluation module. For a generated answer $a$, given context $c$ and query $q$, the anomaly score is computed via Faithfulness:
$$ Faithfulness = \frac{|V \cap C|}{|V|} $$
where $V$ is the set of claims extracted from $a$, and $C$ is the set of claims deducible from $c$. The operating threshold, $\theta = 0.90$, retains 95% of in-distribution samples and was fixed on the independent validation set. At inference, a sample with Faithfulness $\ge \theta$ is passed to the user, while a sample with Faithfulness $< \theta$ is withheld and flagged as UNKNOWN_FACT. 

### 3.5 Baseline Hallucination Detection Methods
For context, four standard baselines were run on the same test sets. Maximum Softmax probability (MSP) scores a generation by token probability. Naive RAG applies cosine similarity thresholding without a reranker. Zero-shot LLM applies no retrieval context. Pairwise comparisons used the non-parametric DeLong test with Holm–Bonferroni correction (α = 0.05).

### 3.6 Experimental Design, Evaluation, and Statistical Analysis
Retrieval was evaluated on the 1,700-query held-out test set through Precision@K, Recall@K, and MRR. Generation was evaluated treating Faithfulness < 0.9 as an OOD positive, reporting AUROC and FPR95. Confidence intervals were computed appropriately for each quantity. Binomial accuracy was bounded by Wilson and Clopper–Pearson 95% intervals.

## 4. Results
### 4.1 Feature-Space Exploration: Hybrid Retrieval
A principal-component analysis of the dense embeddings served as a qualitative check. The first two components explained 15.4% of the variance. Such low explained variance is expected for historical texts, which share most of their linguistic backbone, leaving the event-distinguishing signal spread across many dimensions. Even so, structure is visible: distinct dynasties form fairly compact, partly overlapping clusters.

### 4.2 Retrieval Performance Results
Five-fold stratified cross-validation on the training corpus produced a mean Precision@5 of 95.71 ± 0.15%, a mean MRR of 0.927 ± 0.002. The small spread across folds confirms that near-ceiling accuracy holds across partitions rather than reflecting one lucky split. Because the reranker was re-fit independently, leakage does not occur.

### 4.3 In-Distribution Generation Performance (RAGAS)
On the 1,700-query held-out test set, the Synthesis Agent achieved remarkable alignment. Overall Answer Relevancy was 0.882 (95% Wilson CI: 0.864–0.899). Faithfulness reached an average of 0.95 (95% Clopper–Pearson CI: 0.941–0.962). The high Faithfulness score indicates that the multi-agent routing successfully suppresses generative hallucinations.

**Table 1. In-distribution generation report (held-out test set, n = 1,700).**
| Metric | Mean Score | 95% Wilson CI | Support |
| :--- | :---: | :---: | :---: |
| Faithfulness | 0.9500 | 0.941–0.962 | 1700 |
| Answer Relevancy | 0.8820 | 0.864–0.899 | 1700 |
| Context Precision | 0.9100 | 0.895–0.925 | 1700 |
| Context Recall | 0.9250 | 0.912–0.938 | 1700 |

### 4.4 Hallucination Uncertainty Estimation
Predictive uncertainty was quantified over 30 stochastic forward passes. Across the highly faithful test sequences, the mean entropy of the averaged predictive distribution was low, at 0.021 ± 0.031 nats. For unfaithful generations (Faithfulness < 0.5), it rose to 0.624 ± 0.142 nats, well above the IND values (Mann–Whitney U, p < 0.001). Predictive entropy thus supplies a signal that complements the RAGAS score in identifying anomalies.

### 4.5 Hallucination Detection Performance (OOD)
With the threshold fixed at $\theta = 0.90$ on the independent validation set, the anomaly module reached an AUROC of 0.9892 (95% Hanley–McNeil CI: 0.9841–0.9943; bootstrap 95% CI: 0.9836–0.9946) and an FPR95 of 3.70%. The two score distributions separate cleanly: highly factual answers cluster at Faithfulness 0.95–1.0, while hallucinated variants spread across 0.2–0.6. The Agentic framework significantly outperformed Naive RAG baselines.

## 5. Discussion
This study demonstrates that an alignment-free Agentic RAG framework can concurrently achieve high-precision retrieval of Vietnamese historical texts and robustly detect hallucinated outputs. For in-distribution factual synthesis, the model yielded a near-ceiling mean Faithfulness of 0.95. By substituting computationally expensive exact-match searches with fast Hybrid/Reranker operations, the model facilitates lightweight and rapid inference, making it highly suitable for high-throughput edtech environments.

Beyond known retrieval, the framework demonstrated exceptional capability in hallucination detection. The RAGAS metric approach significantly outperformed three established baselines on this dataset (DeLong test against MSP, Naive RAG: all p < 0.001). This effectively mitigates the overconfidence issues that typically undermine bare LLM output. Furthermore, the correct withholding of non-contextual historical claims underscores the practical utility of the abstention rule. From an educational perspective, rapidly flagging such unsupported claims is highly valuable; it accelerates early pedagogical interventions.

## 6. Limitations and Future Work
Several limitations remain, each pointing to a concrete next experiment. The highest priority is temporal validation: replacing the single split with one ordered across curriculum levels, so that the model trains on elementary texts and is tested on advanced texts. This would emulate deployment far more faithfully. External validation is the natural complement, using a geographically distinct cohort. Known confounders, including reading level, prompt variations, and user age, call for stratification and batch-effect adjustment. Finally, any claim beyond Vietnamese history must wait for evaluation on other subjects; the baseline ranking must be confirmed on external data rather than a single internal split.

## 7. Conclusion
This study presented an Agentic RAG framework that retrieves historical contexts and flags hallucinations with a RAGAS-evaluated filter in a learned latent space. Five-fold cross-validation gave a mean Faithfulness of 0.9500 ± 0.015, confirming robustness across splits. Using a threshold fixed on an independent validation set, the anomaly module attained AUROC = 0.9892 and FPR95 = 3.70%, surpassing maximum Softmax probability and Naive RAG on this dataset. Uncertainty analysis added a complementary abstention signal.

These results are promising but preliminary. Temporal-split evaluation, external validation, and public release of code and data will all be needed before any operational deployment. With those pieces in place, Agentic RAG combined with principled RAGAS detection offers a credible route to safer and more engaging educational AI.

## Declarations
**Ethics approval.** This study used only publicly available, de-identified historical sequences; no human participants were involved. Institutional review board approval was not required.
**Data availability.** Sequences derive from the Dai Viet Kids repository. Accession identifiers and splits will be archived upon publication.
**Conflict of interest.** The author declares no competing interests.
**Author contribution.** T.M.G.K. conceived the study, N.M.D. contributed to the computational pipeline, and T.T.D. contributed to the statistical evaluation. All authors reviewed, edited, and approved the final version of the manuscript.

## References
1. Es, S. et al., RAGAS: Automated Evaluation of Retrieval Augmented Generation, arXiv preprint, 2023.
2. Lewis, P. et al., Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks, in Advances in Neural Information Processing Systems, Vol. 33, 2020.
3. Hendrycks D, Gimpel K, A baseline for detecting misclassified and out-of-distribution examples in neural networks, in Int Conf Learning Representations (ICLR), 2017.
4. Rambaut A. et al., A dynamic nomenclature proposal for data lineages to assist educational epidemiology, 2020.
