#!/usr/bin/env bash
# 重新生成自托管字体（Material Symbols 图标子集 + Roboto 拉丁子集）。
#
# 为什么需要这个脚本：Google Fonts 提供的 Material Symbols Rounded 可变字体
# 完整文件有 5.1 MB。这里用 icon_names 参数只取实际用到的图标，产物约 70 KB。
# 新增图标后，把图标名加进下面的 ICONS 列表并重新运行本脚本。
#
# 用法：bash <主题目录>/scripts/fetch-fonts.sh（在哪个目录执行都可以）
set -euo pipefail

OUT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/src/assets/fonts"
UA="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"

# 全站实际使用的图标名（由 <md-icon>、config 的 *Icon 字段和 JS 动态赋值汇总而来）。
ICONS="add,arrow_back,arrow_forward,arrow_outward,article,auto_awesome,auto_stories,\
calendar_today,category,check,check_circle,close,code,code_blocks,content_copy,dark_mode,\
diversity_3,download,edit_note,error,expand_more,face,favorite,folder,folder_off,\
format_list_bulleted,format_quote,group,history,home,inventory_2,label,language,light_mode,\
link,mail,manage_search,menu,monitoring,north_east,palette,pending,person_add,pets,\
progress_activity,public,rss_feed,schedule,search,search_off,send,tag,terminal,timeline,\
unfold_more,warning,waving_hand"

mkdir -p "$OUT_DIR"

fetch_font() {
    local css_url="$1" out="$2" filter="${3:-}"
    local css font_url
    css=$(curl -fsS -A "$UA" "$css_url")
    if [ -n "$filter" ]; then
        # 只取指定 unicode 子集（例如 latin）对应的那一段 @font-face。
        font_url=$(printf '%s' "$css" | awk -v want="/* $filter */" '
            $0 == want { grab = 1 }
            grab && /src: url\(/ { sub(/.*src: url\(/, ""); sub(/\).*/, ""); print; exit }
        ')
    else
        font_url=$(printf '%s' "$css" | sed -n 's/.*src: url(\([^)]*\)).*/\1/p' | head -1)
    fi
    [ -n "$font_url" ] || { echo "无法从 $css_url 解析字体地址" >&2; exit 1; }
    curl -fsS -A "$UA" -o "$OUT_DIR/$out" "$font_url"
    printf '%-40s %8s bytes\n' "$out" "$(stat -c%s "$OUT_DIR/$out")"
}

# 图标字体：保留 opsz/wght/FILL/GRAD 四个可变轴，仅子集化字形。
fetch_font \
    "https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&icon_names=$(printf '%s' "$ICONS" | tr -d ' \\\n')" \
    "material-symbols-rounded-subset.woff2"

# 正文西文字体：Roboto 可变字体，只要 latin / latin-ext 两段。
fetch_font "https://fonts.googleapis.com/css2?family=Roboto:wght@100..900" "roboto-latin.woff2" "latin"
fetch_font "https://fonts.googleapis.com/css2?family=Roboto:wght@100..900" "roboto-latin-ext.woff2" "latin-ext"
