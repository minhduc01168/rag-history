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
    fig, ax = plt.subplots(figsize=(12, 6.5), dpi=300)
    ax.axis('off')

    # Color palette (Academic clean)
    c_input = "#E0F2FE"     # Light blue
    c_guard = "#FEE2E2"     # Light red/pink
    c_router = "#FEF3C7"    # Light amber
    c_retrieval = "#E0E7FF" # Light indigo
    c_rerank = "#EDE9FE"    # Light purple
    c_agent = "#DCFCE7"     # Light green
    c_border = "#334155"

    def draw_box(x, y, w, h, title, subtitle="", color="#FFFFFF", corner=0.08):
        rect = patches.FancyBboxPatch((x, y), w, h, boxstyle=f"round,pad=0.02,rounding_size={corner}",
                                      ec=c_border, fc=color, lw=1.5, zorder=2)
        ax.add_patch(rect)
        if subtitle:
            ax.text(x + w/2, y + h*0.62, title, ha='center', va='center', fontweight='bold', fontsize=10.5, color="#0F172A", zorder=3)
            ax.text(x + w/2, y + h*0.30, subtitle, ha='center', va='center', fontsize=8.5, color="#475569", zorder=3)
        else:
            ax.text(x + w/2, y + h/2, title, ha='center', va='center', fontweight='bold', fontsize=10.5, color="#0F172A", zorder=3)

    def draw_arrow(x1, y1, x2, y2, label=""):
        ax.annotate('', xy=(x2, y2), xytext=(x1, y1),
                    arrowprops=dict(arrowstyle="->", color="#1E293B", lw=1.8, shrinkA=4, shrinkB=4), zorder=4)
        if label:
            ax.text((x1+x2)/2, (y1+y2)/2 + 0.03, label, ha='center', va='bottom', fontsize=8, fontweight='bold', color="#0284C7", zorder=5)

    # 1. Input Box
    draw_box(0.02, 0.40, 0.16, 0.20, "Student Query", "Lớp 4 & 5 Student\n(Text / Voice)", c_input)

    # 2. Child Safety Guardrail
    draw_box(0.22, 0.40, 0.16, 0.20, "Safety Guardrail", "Regex, PII Scrubbing,\nToxicity Filter", c_guard)
    draw_arrow(0.18, 0.50, 0.22, 0.50)

    # 3. Router Agent
    draw_box(0.42, 0.40, 0.15, 0.20, "Router Agent", "Intent Classifier\n(Knowledge/Quiz/Role)", c_router)
    draw_arrow(0.38, 0.50, 0.42, 0.50, "Safe")

    # 4. Hybrid Retrieval Box (Large container)
    retrieval_bg = patches.FancyBboxPatch((0.61, 0.12), 0.18, 0.76, boxstyle="round,pad=0.02,rounding_size=0.05",
                                         ec="#6366F1", fc=c_retrieval, lw=1.5, linestyle='--', zorder=1)
    ax.add_patch(retrieval_bg)
    ax.text(0.70, 0.84, "Hybrid Retrieval", ha='center', va='center', fontweight='bold', fontsize=10, color="#4338CA")

    # Inner components
    draw_box(0.625, 0.58, 0.15, 0.18, "BM25 Sparse", "Lexical Keyword\n914 chunks", "#FFFFFF")
    draw_box(0.625, 0.32, 0.15, 0.18, "Dense Vector", "Harrier 1024-d\nCosine Sim", "#FFFFFF")
    draw_box(0.625, 0.14, 0.15, 0.12, "RRF Fusion", "k=60 (Top-15)", "#FEF08A")

    draw_arrow(0.57, 0.54, 0.625, 0.67)
    draw_arrow(0.57, 0.46, 0.625, 0.41)
    draw_arrow(0.70, 0.58, 0.70, 0.26)
    draw_arrow(0.70, 0.32, 0.70, 0.26)

    # 5. Cross-Encoder Reranker
    draw_box(0.83, 0.40, 0.15, 0.20, "Cross-Encoder", "ms-marco-MiniLM\nRerank -> Top 5", c_rerank)
    draw_arrow(0.775, 0.20, 0.83, 0.45, "Top 15")

    # 6. Synthesis Agent (Persona Cụ Rùa)
    draw_box(0.42, 0.05, 0.36, 0.18, "Synthesis Agent (Persona Cụ Rùa)", "Pedagogical Storytelling Prompting + Grounded LLM Generation", c_agent)
    draw_arrow(0.88, 0.40, 0.78, 0.14, "Top-5 Contexts")

    # Output Arrow back to user
    draw_arrow(0.42, 0.14, 0.10, 0.14)
    draw_box(0.02, 0.05, 0.16, 0.18, "Pedagogical Output", "Sanitized Fact\nWarm & Engaging", "#F1F5F9")

    # Branching for Roleplay / Quiz
    draw_box(0.42, 0.75, 0.15, 0.18, "Quiz / Roleplay", "Interactive Mode\nHero Personas", "#FDF4FF")
    draw_arrow(0.495, 0.60, 0.495, 0.75, "Specialized")

    plt.title("Figure 1: End-to-End Architecture of the Dai Viet Kids Agentic RAG Framework", pad=15, fontweight='bold', color="#0F172A")
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
