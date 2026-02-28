

# ATS Checker AI — Implementation Plan

## Overview
A modern web app where users upload their resume and paste a job description to get an AI-powered match analysis with actionable improvement suggestions.

## Phase 1: Core Experience (This Build)

### 1. Landing Page & Layout
- Clean, professional hero section with app branding ("ATS Checker AI")
- Dark/light mode toggle in the header
- Color palette: blues, purples, and grays for a professional SaaS feel
- Smooth transitions and subtle shadows throughout

### 2. Resume Upload & Job Description Input
- Drag-and-drop file upload zone accepting PDF and DOCX files
- Text area for pasting the job description
- Clear "Analyze" button to trigger the analysis
- Client-side file validation (type, size limits)

### 3. AI-Powered Analysis (Backend)
- Edge function that receives the resume text and job description
- Uses Lovable AI (Gemini) to analyze and extract:
  - **Match percentage score** between resume and JD
  - **Matched skills** found in both documents
  - **Missing keywords** present in JD but absent from resume
  - **Improvement suggestions** for each missing area
  - **ATS compatibility tips**
  - **AI-generated bullet point rewrites** for weak sections
- Text extraction from PDF/DOCX handled server-side in the edge function

### 4. Results Dashboard
- **Circular progress indicator** showing the match score (e.g., 78%)
- **Skills comparison** — two columns showing matched vs. missing skills
- **Keyword table** — comparison of JD keywords vs. resume keywords with status indicators
- **Improvement suggestions section** — actionable cards with specific recommendations
- **ATS compatibility score** with tips
- Loading animation while the AI processes

## Phase 2: Future Enhancements (Not in this build)
- User authentication (sign up/login) to save analyses
- Analysis history with ability to revisit past results
- Downloadable PDF report of the analysis
- AI chatbot for follow-up questions ("Why is my score low?", "Rewrite this bullet point")
- Keyword density analysis visualization

## Tech Approach
- **Frontend**: React + Tailwind CSS + shadcn/ui components
- **Backend**: Lovable Cloud edge functions
- **AI**: Lovable AI gateway (Gemini model) for resume analysis
- **File parsing**: Server-side PDF/DOCX text extraction in edge functions

