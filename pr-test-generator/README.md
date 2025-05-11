# מחולל בדיקות יחידה לבקשות משיכה (PR)

כלי אוטומטי ליצירת בדיקות יחידה לפונקציות חדשות בבקשות משיכה באמצעות AI.

## תכונות

- זיהוי אוטומטי של פונקציות חדשות ב-PR
- יצירת בדיקות יחידה באמצעות OpenAI API
- פרסום הבדיקות כתגובה ב-PR
- תמיכה בשפות: TypeScript, JavaScript, Python ועוד

## התקנה

1. וודא שיש לך Node.js במהדורה 18 ומעלה מותקנת
2. התקן את התלויות:

```bash
cd pr-test-generator
npm install
```

3. בנה את הפרויקט:

```bash
npm run build
```

4. צור קובץ `.env` עם המפתחות הנדרשים (התבסס על `.env.example`):

```env
TOKEN=your_github_token_here
OPENAI_API_KEY=your_openai_api_key_here
DEFAULT_REPO_OWNER=ItamarZand88
DEFAULT_REPO_NAME=TeamTime
```

## שימוש

### הפעלה מקומית

```bash
npm start <pr-number> [repo-owner] [repo-name]
```

לדוגמה:

```bash
npm start 123 ItamarZand88 TeamTime
```

### הפעלה באמצעות GitHub Actions

הפעולה תרוץ אוטומטית בכל פעם שנפתח PR חדש או כאשר יש עדכון ל-PR קיים.

ניתן גם להפעיל את הפעולה באופן ידני:
1. נווט לפרויקט ב-GitHub
2. עבור לתפריט Actions
3. בחר בפעולה "Generate Unit Tests"
4. לחץ על "Run workflow"
5. הזן את מספר ה-PR
6. לחץ על "Run workflow"

## הוספת הסודות לפרויקט GitHub

כדי שהפעולה תעבוד ב-GitHub Actions, יש להגדיר את הסודות הבאים:

1. נווט לפרויקט ב-GitHub
2. עבור להגדרות (Settings)
3. בחר ב-Secrets > Actions
4. הוסף את הסודות הבאים:
   - `TOKEN` (טוקן GitHub עם הרשאות repo)
   - `OPENAI_API_KEY` (מפתח ה-API של OpenAI)