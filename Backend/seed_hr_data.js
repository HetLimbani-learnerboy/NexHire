// Seed test data for candidates and interviews
const http = require("http");

const post = (path, body) => new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const req = http.request({
        hostname: "localhost", port: 5001, path, method: "POST",
        headers: { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(data) },
    }, (res) => {
        let out = "";
        res.on("data", d => out += d);
        res.on("end", () => { try { resolve(JSON.parse(out)); } catch { resolve(out); } });
    });
    req.on("error", reject);
    req.write(data);
    req.end();
});

async function seed() {
    console.log("Seeding candidates...");
    const candidates = [
        { full_name: "Aditya Patel", email: "aditya@gmail.com", job_title: "Senior React Developer", vendor_name: "TechStaff Solutions", status: "Interview" },
        { full_name: "Sneha Sharma", email: "sneha.s@gmail.com", job_title: "Full Stack Developer", vendor_name: "InnoRecruit Pvt Ltd", status: "Screened" },
        { full_name: "Ravi Verma", email: "ravi.v@yahoo.com", job_title: "DevOps Engineer", vendor_name: "CloudHire Global", status: "Submitted" },
        { full_name: "Neha Gupta", email: "neha.g@outlook.com", job_title: "Data Analyst", vendor_name: "SkillBridge HR", status: "Offered" },
        { full_name: "Vikram Joshi", email: "vikram.j@gmail.com", job_title: "Senior React Developer", vendor_name: "HireWave Tech", status: "Hired" },
        { full_name: "Priyanka Das", email: "priyanka.d@gmail.com", job_title: "UI/UX Designer", vendor_name: "RecruitEdge", status: "Interview" },
        { full_name: "Kavita Singh", email: "kavita.s@gmail.com", job_title: "Full Stack Developer", vendor_name: "ProHire Solutions", status: "Screened" },
        { full_name: "Rohit Kumar", email: "rohit.k@gmail.com", job_title: "QA Automation Engineer", vendor_name: "TechStaff Solutions", status: "Submitted" },
    ];

    for (const c of candidates) {
        const r = await post("/api/candidates", c);
        console.log(`  ✅ ${c.full_name}: ${r.success ? "OK" : r.message}`);
    }

    console.log("\nSeeding interviews...");
    const interviews = [
        { candidate_name: "Aditya Patel", role: "Senior React Developer", interview_date: "2026-04-28", interview_time: "10:00", mode: "Video", meeting_link: "https://meet.google.com/abc-def-ghi" },
        { candidate_name: "Priyanka Das", role: "UI/UX Designer", interview_date: "2026-04-28", interview_time: "14:30", mode: "In-Person" },
        { candidate_name: "Neha Gupta", role: "Data Analyst", interview_date: "2026-04-29", interview_time: "11:00", mode: "Video", meeting_link: "https://meet.google.com/xyz-uvw-rst" },
    ];

    for (const i of interviews) {
        const r = await post("/api/interviews", i);
        console.log(`  ✅ ${i.candidate_name}: ${r.success ? "OK" : r.message}`);
    }

    // Add feedback to one interview to test view mode
    console.log("\nAdding feedback to interview 1...");
    const fbRes = await new Promise((resolve, reject) => {
        const data = JSON.stringify({ rating: 4, remarks: "Strong technical skills. Good communication.", recommendation: "Hire" });
        const req = http.request({
            hostname: "localhost", port: 5001, path: "/api/interviews/1/feedback", method: "PATCH",
            headers: { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(data) },
        }, (res) => {
            let out = "";
            res.on("data", d => out += d);
            res.on("end", () => { try { resolve(JSON.parse(out)); } catch { resolve(out); } });
        });
        req.on("error", reject);
        req.write(data);
        req.end();
    });
    console.log(`  ✅ Feedback: ${fbRes.success ? "OK" : fbRes.message}`);

    console.log("\n🎉 Seeding complete!");
}

seed().catch(console.error);
