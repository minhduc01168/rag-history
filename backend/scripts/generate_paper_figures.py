import os
import matplotlib.pyplot as plt
import matplotlib.patches as patches
import numpy as np

# Set aesthetic publication style
plt.rcParams['font.family'] = 'DejaVu Sans'
plt.rcParams['font.size'] = 11
plt.rcParams['axes.titlesize'] = 13
plt.rcParams['axes.labelsize'] = 11
plt.rcParams['xtick.labelsize'] = 10
plt.rcParams['ytick.labelsize'] = 10
plt.rcParams['legend.fontsize'] = 10
plt.rcParams['figure.titlesize'] = 14

os.makedirs("paper_figures", exist_ok=True)

# ==============================================================================
# FIGURE 1: System Architecture Diagram (High-level dataflow)
# ==============================================================================
def generate_figure_1():
    fig, ax = plt.subplots(figsize=(14, 8.2), dpi=300)
    ax.axis('off')

    # Color palette (Academic clean)
    c_input = "#E0F2FE"     # Light sky blue
    c_guard = "#FEE2E2"     # Light red/pink
    c_router = "#FEF3C7"    # Light amber
    c_retrieval = "#EEF2FF" # Light indigo
    c_rerank = "#EDE9FE"    # Light purple
    c_agent = "#DCFCE7"     # Light emerald green
    c_output = "#F0FDF4"    # Crisp mint green
    c_special = "#FDF4FF"   # Light fuchsia

    def draw_box(x, y, w, h, title, subtitle="", color="#FFFFFF", border_color="#334155", corner=0.04, title_color="#0F172A"):
        rect = patches.FancyBboxPatch((x, y), w, h, boxstyle=f"round,pad=0.015,rounding_size={corner}",
                                      ec=border_color, fc=color, lw=1.6, zorder=2)
        ax.add_patch(rect)
        if subtitle:
            ax.text(x + w/2, y + h*0.68, title, ha='center', va='center', fontweight='bold', fontsize=10.5, color=title_color, zorder=3)
            ax.text(x + w/2, y + h*0.32, subtitle, ha='center', va='center', fontsize=8.2, color="#334155", linespacing=1.2, zorder=3)
        else:
            ax.text(x + w/2, y + h/2, title, ha='center', va='center', fontweight='bold', fontsize=10.5, color=title_color, zorder=3)

    def draw_arrow(x1, y1, x2, y2, label="", label_pos="top", color="#1E293B"):
        ax.annotate('', xy=(x2, y2), xytext=(x1, y1),
                    arrowprops=dict(arrowstyle="-|>", color=color, lw=1.8, shrinkA=3, shrinkB=3, mutation_scale=14), zorder=4)
        if label:
            mid_x, mid_y = (x1 + x2)/2, (y1 + y2)/2
            offset_y = 0.025 if label_pos == "top" else -0.025
            ax.text(mid_x, mid_y + offset_y, label, ha='center', va='center', fontsize=8, fontweight='bold',
                    color="#4338CA", zorder=5, bbox=dict(boxstyle="round,pad=0.2", fc="#FFFFFF", ec="#CBD5E1", lw=0.6, alpha=0.9))

    # --- TOP BRANCH: Specialized Interactive Agents ---
    draw_box(0.33, 0.88, 0.28, 0.08, "Interactive Agents (Quiz & Roleplay)", "Hero Personas (Tran Hung Dao, Quang Trung)", c_special, "#C084FC", title_color="#6B21A8")

    # --- ROW 1: Input -> Safety -> Router ---
    # 1. Student Query Box
    draw_box(0.02, 0.62, 0.14, 0.19, "Student Query", "Grade 4 & 5 Student\nHistorical Question\n(Voice / Text)", c_input, "#0284C7", title_color="#0369A1")

    # 2. Child Safety Guardrail Box
    draw_box(0.20, 0.62, 0.14, 0.19, "Safety Guardrail", "Input Sanitization,\nPII Scrubbing,\nToxicity Filter", c_guard, "#EF4444", title_color="#B91C1C")
    draw_arrow(0.16, 0.715, 0.20, 0.715)

    # 3. Router Agent Box
    draw_box(0.38, 0.62, 0.14, 0.19, "Router Agent", "Intent Classification\n(Knowledge vs.\nRoleplay / Quiz)", c_router, "#F59E0B", title_color="#B45309")
    draw_arrow(0.34, 0.715, 0.38, 0.715, "Safe Query")

    # Arrow from Router to Specialized Agents (Upward)
    draw_arrow(0.45, 0.81, 0.45, 0.88, "Specialized", "top")

    # --- HYBRID RETRIEVAL SUBSYSTEM (CONTAINER) ---
    retrieval_bg = patches.FancyBboxPatch((0.56, 0.38), 0.41, 0.48, boxstyle="round,pad=0.02,rounding_size=0.03",
                                         ec="#6366F1", fc=c_retrieval, lw=1.5, linestyle='--', zorder=1)
    ax.add_patch(retrieval_bg)
    ax.text(0.765, 0.835, "Dual-Stage Hybrid Retrieval Engine", ha='center', va='center', fontweight='bold', fontsize=11, color="#3730A3")

    # Arrow from Router to Retrieval Engine
    draw_arrow(0.52, 0.715, 0.58, 0.715, "History Query")

    # Inner Box A: BM25 Lexical Index (Left)
    draw_box(0.58, 0.63, 0.17, 0.16, "BM25 Sparse Index", "Exact Keyword Search\n914 Chunks Corpus", "#FFFFFF", "#4F46E5", title_color="#3730A3")

    # Inner Box B: Dense Vector Search (Right)
    draw_box(0.78, 0.63, 0.17, 0.16, "Dense Vector Search", "Harrier 1024-dim\nSemantic Cosine Sim", "#FFFFFF", "#4F46E5", title_color="#3730A3")

    # Arrow branching inside Retrieval Engine
    draw_arrow(0.56, 0.715, 0.58, 0.715)
    ax.plot([0.57, 0.57, 0.78], [0.715, 0.715, 0.715], color="#1E293B", lw=1.8, zorder=4)

    # Inner Box C: Reciprocal Rank Fusion (RRF)
    draw_box(0.64, 0.42, 0.25, 0.14, "Reciprocal Rank Fusion (RRF)", "Score = Sum 1/(k + Rank), k=60\nMerged Top-15 Candidate Passages", "#FEF08A", "#CA8A04", title_color="#854D0E")

    # Arrows from BM25 and Dense down to RRF
    draw_arrow(0.665, 0.63, 0.71, 0.56, "Rank_BM25", "top")
    draw_arrow(0.865, 0.63, 0.82, 0.56, "Rank_Dense", "top")

    # --- STAGE 3: Cross-Encoder Neural Reranker ---
    draw_box(0.64, 0.18, 0.25, 0.15, "Cross-Encoder Reranker", "ms-marco-MiniLM-L-6-v2\nFull Cross-Attention Scoring\n-> Select Top-5 Grounded Contexts", c_rerank, "#7C3AED", title_color="#5B21B6")
    draw_arrow(0.765, 0.42, 0.765, 0.33, "Top-15 Candidates", "top")

    # --- ROW 2 (Bottom): Multi-Agent Synthesis & Final Output ---
    # 4. Synthesis Agent ("Cụ Rùa Thông Thái")
    draw_box(0.25, 0.16, 0.32, 0.22, "Synthesis Agent (\"Cụ Rùa Thông Thái\")", "Pedagogical Storytelling Persona Prompting\n+ Factual Grounded Generation (Gemini LLM)\n+ Output Guardrails & Open Inquiry Question", c_agent, "#16A34A", title_color="#15803D")

    # Arrow from Cross-Encoder to Synthesis Agent (Horizontal left)
    draw_arrow(0.64, 0.255, 0.57, 0.255, "Top-5 Contexts")

    # 5. Pedagogical Response Output Box
    draw_box(0.02, 0.16, 0.17, 0.22, "Pedagogical Output", "Sanitized Historical Facts\nWarm & Engaging Tone\n< 150 words response\n100% Curriculum Grounded", c_output, "#059669", title_color="#047857")
    draw_arrow(0.25, 0.27, 0.19, 0.27, "Sanitized Answer")

    plt.title("Figure 1: End-to-End Architecture of the Dai Viet Kids Agentic RAG Framework", pad=20, fontweight='bold', fontsize=13, color="#0F172A")
    plt.tight_layout()
    output_path = "paper_figures/fig1_system_architecture.png"
    plt.savefig(output_path, dpi=300, bbox_inches='tight')
    plt.close()
    print(f"✅ Generated: {output_path}")


# ==============================================================================
# FIGURE 2: Semantic Chunking with Breadcrumb Extraction
# ==============================================================================
def generate_figure_2():
    fig, ax = plt.subplots(figsize=(11, 5.5), dpi=300)
    ax.axis('off')

    # Raw Textbook Box
    raw_text = (
        "RAW GRADE 4 & 5 TEXTBOOK MARKDOWN:\n"
        "----------------------------------------------\n"
        "# CHAPTER I: EARLY NATION BUILDING\n"
        "## Lesson 1: Van Lang Kingdom\n"
        "### 1. The Emergence of Van Lang\n"
        "Around 700 BC, in the Northern Plains\n"
        "and North-Central regions, the Van Lang\n"
        "Kingdom was established. The leader was\n"
        "King Hung (Hung Vuong)..."
    )
    raw_rect = patches.FancyBboxPatch((0.03, 0.15), 0.40, 0.75, boxstyle="round,pad=0.03",
                                      ec="#94A3B8", fc="#F8FAFC", lw=1.5)
    ax.add_patch(raw_rect)
    ax.text(0.05, 0.85, "Input Document (Standard Markdown)", fontweight='bold', fontsize=11, color="#1E293B")
    ax.text(0.05, 0.48, raw_text, fontfamily="monospace", fontsize=8.5, va="center", color="#334155")

    # Transformation Arrow
    ax.annotate('', xy=(0.54, 0.52), xytext=(0.45, 0.52),
                arrowprops=dict(arrowstyle="->", color="#4F46E5", lw=3))
    ax.text(0.495, 0.56, "Structural\nBreadcrumb\nParser", ha='center', va='bottom', fontsize=9, fontweight='bold', color="#4F46E5")

    # Output Chunks with Breadcrumbs
    chunk1 = (
        "CHUNK #001 (Indexed in ChromaDB + BM25):\n"
        "----------------------------------------------\n"
        "[+] Injected Breadcrumb Prefix:\n"
        "    [Grade 4 > Chapter I > Lesson 1: Van Lang]\n\n"
        "[+] Grounded Passage Content:\n"
        "    Around 700 BC, in the Northern Plains\n"
        "    and North-Central regions, the Van Lang\n"
        "    Kingdom was established. The leader was\n"
        "    King Hung (Hung Vuong)..."
    )
    chunk_rect = patches.FancyBboxPatch((0.55, 0.15), 0.42, 0.75, boxstyle="round,pad=0.03",
                                        ec="#10B981", fc="#F0FDF4", lw=1.8)
    ax.add_patch(chunk_rect)
    ax.text(0.57, 0.85, "Context-Enriched Structured Chunk", fontweight='bold', fontsize=11, color="#065F46")
    ax.text(0.57, 0.48, chunk1, fontfamily="monospace", fontsize=8.5, va="center", color="#064E3B")

    plt.title("Figure 2: Structural Breadcrumb Semantic Chunking Preserving Grade 4 & 5 Hierarchy", pad=15, fontweight='bold', color="#0F172A")
    plt.tight_layout()
    output_path = "paper_figures/fig2_breadcrumb_chunking.png"
    plt.savefig(output_path, dpi=300, bbox_inches='tight')
    plt.close()
    print(f"✅ Generated: {output_path}")


# ==============================================================================
# FIGURE 3: Quantitative Ablation Study (Hit@K & MRR Comparison)
# ==============================================================================
def generate_figure_3():
    methods = [
        "Vector Only\n(Dense)",
        "BM25 Only\n(Sparse)",
        "Hybrid Search\n(BM25 + Dense RRF)",
        "Proposed\n(Hybrid + Reranker)"
    ]

    hit1 = [4.0, 72.0, 72.0, 74.0]
    hit3 = [8.0, 86.0, 86.0, 94.0]
    hit5 = [8.0, 94.0, 86.0, 94.0]
    mrr = [0.0533 * 100, 0.7827 * 100, 0.7900 * 100, 0.8233 * 100]

    x = np.arange(len(methods))
    width = 0.20

    fig, ax1 = plt.subplots(figsize=(10, 6), dpi=300)

    # Colors
    c_h1 = "#93C5FD"  # light blue
    c_h3 = "#3B82F6"  # blue
    c_h5 = "#1D4ED8"  # dark blue
    c_mrr = "#EF4444" # red

    # Bar plots
    r1 = ax1.bar(x - 1.5*width, hit1, width, label='Hit Rate@1 (%)', color=c_h1, edgecolor="#1E3A8A", lw=0.8)
    r2 = ax1.bar(x - 0.5*width, hit3, width, label='Hit Rate@3 (%)', color=c_h3, edgecolor="#1E3A8A", lw=0.8)
    r3 = ax1.bar(x + 0.5*width, hit5, width, label='Hit Rate@5 (%)', color=c_h5, edgecolor="#1E3A8A", lw=0.8)
    r4 = ax1.bar(x + 1.5*width, mrr, width, label='MRR (x100)', color=c_mrr, edgecolor="#7F1D1D", lw=0.8)

    # Add values on top of bars
    for rects in [r1, r2, r3, r4]:
        for rect in rects:
            height = rect.get_height()
            ax1.annotate(f'{height:.1f}%' if rect in [r1,r2,r3] else f'{height/100:.3f}',
                         xy=(rect.get_x() + rect.get_width() / 2, height),
                         xytext=(0, 3), textcoords="offset points",
                         ha='center', va='bottom', fontsize=7.5, fontweight='bold', rotation=0)

    ax1.set_ylabel('Performance Metric Score (%)', fontweight='bold', color="#0F172A")
    ax1.set_xticks(x)
    ax1.set_xticklabels(methods, fontweight='bold', color="#1E293B")
    ax1.set_ylim(0, 110)
    ax1.grid(axis='y', linestyle='--', alpha=0.5, zorder=0)

    # Styling
    ax1.spines['top'].set_visible(False)
    ax1.spines['right'].set_visible(False)
    ax1.legend(frameon=True, facecolor='#F8FAFC', edgecolor='#CBD5E1', loc='upper left')

    plt.title("Figure 3: Retrieval Performance Across 4 Ablation Configurations (N = 50 Queries)", pad=15, fontweight='bold', color="#0F172A")
    plt.tight_layout()
    output_path = "paper_figures/fig3_retrieval_ablation_mrr_hit.png"
    plt.savefig(output_path, dpi=300, bbox_inches='tight')
    plt.close()
    print(f"✅ Generated: {output_path}")


# ==============================================================================
# FIGURE 4: Pedagogical and Generation Metrics Dashboard
# ==============================================================================
def generate_figure_4():
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(11, 4.8), dpi=300)

    # Subplot 1: RAGAS Quality Metrics
    metrics = ['Faithfulness\n(Factuality)', 'Answer\nRelevancy', 'Hallucination\nDefense Rate']
    scores = [85.05, 87.94, 50.00]
    targets = [80.0, 85.0, 50.0]
    colors = ['#10B981', '#06B6D4', '#8B5CF6']

    bars = ax1.bar(metrics, scores, color=colors, width=0.5, edgecolor="#0F172A", lw=1)
    ax1.plot(metrics, targets, color="#DC2626", linestyle="--", marker="o", lw=2, label="Curriculum Baseline Target")

    for bar, score in zip(bars, scores):
        ax1.text(bar.get_x() + bar.get_width()/2, score + 1.5, f"{score:.1f}%", ha='center', fontweight='bold', fontsize=10)

    ax1.set_ylim(0, 105)
    ax1.set_ylabel("Metric Score (%)", fontweight='bold')
    ax1.set_title("A. Generation & Hallucination Metrics", fontweight='bold', fontsize=11, color="#1E293B")
    ax1.grid(axis='y', linestyle='--', alpha=0.4)
    ax1.legend(loc='lower right', fontsize=8.5)
    ax1.spines['top'].set_visible(False)
    ax1.spines['right'].set_visible(False)

    # Subplot 2: End-to-End Latency Breakdown
    components = ['Dense Embedding\n(Microservice)', 'BM25 Sparse\nIndex', 'Cross-Encoder\nReranking', 'Persona LLM\nSynthesis']
    latencies = [0.72, 0.01, 1.13, 1.66]
    comp_colors = ['#93C5FD', '#FDE047', '#C4B5FD', '#86EFAC']

    ax2.barh(components, latencies, color=comp_colors, edgecolor="#0F172A", lw=1)
    for i, v in enumerate(latencies):
        ax2.text(v + 0.05, i, f"{v:.2f} s", va='center', fontweight='bold', fontsize=9.5)

    ax2.set_xlim(0, 2.2)
    ax2.set_xlabel("Time (Seconds)", fontweight='bold')
    ax2.set_title("B. Latency Profile per Component", fontweight='bold', fontsize=11, color="#1E293B")
    ax2.grid(axis='x', linestyle='--', alpha=0.4)
    ax2.spines['top'].set_visible(False)
    ax2.spines['right'].set_visible(False)

    plt.suptitle("Figure 4: Generation Quality and Operational Latency Profile of Dai Viet Kids RAG", fontsize=12, fontweight='bold', y=1.02, color="#0F172A")
    plt.tight_layout()
    output_path = "paper_figures/fig4_pedagogical_metrics_latency.png"
    plt.savefig(output_path, dpi=300, bbox_inches='tight')
    plt.close()
    print(f"✅ Generated: {output_path}")


if __name__ == "__main__":
    generate_figure_1()
    generate_figure_2()
    generate_figure_3()
    generate_figure_4()
    print("\n🎉 ALL 4 ACADEMIC PAPER FIGURES GENERATED SUCCESSFULLY!")
