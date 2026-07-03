/**
 * "山田太郎\n佐藤花子\n\n鈴木一郎" のような改行区切りテキストを
 * 空行・前後の空白を除いた名前の配列に変換する。
 */
export function parseMembers(text) {
  return text
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);
}
