
  document.getElementById("send").addEventListener("click", async function (e) {
    e.preventDefault();

    const message = document.getElementById("message").value;
    console.log("User Message:", message);

    // Clear input field
    document.getElementById("message").value = "";

    try {
      const res = await fetch("http://localhost:6001/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();
      console.log("AI Response:", data);

   
      localStorage.setItem('chatResponse', data.reply);
      window.location.href = 'response.html';

    } catch (error) {
      console.error("Error communicating with chat API:", error);
      alert("Something went wrong. Please try again.");
    }
  });


  