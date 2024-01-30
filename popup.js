document.addEventListener("DOMContentLoaded", async () => {

    const usernameInput = document.getElementById("username");
    usernameInput.value = (await chrome.storage.sync.get("username")).username

    const form = document.getElementById("username-form")
    
    const editIcon = document.getElementById("editIcon")
    const successIcon = document.getElementById("successIcon")

    const editUsername = (e) => {
        e.preventDefault()
        console.log("Saving new username")
        chrome.storage.sync.set({ username: usernameInput.value })
        editIcon.classList.add("hidden")
        successIcon.classList.remove("hidden")
    }

    form.addEventListener("submit",(e) =>  editUsername(e))

});
