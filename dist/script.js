document.addEventListener("DOMContentLoaded", () => {
	const refreshWindow = document.querySelector(".refresh-window");
	//DarkMode variables
	let toggleDark = document.querySelector("#toggleDark");
	let toggleLight = document.querySelector("#toggleLight");
	// todo variables
	const taskInput = document.querySelector("#taskInput"); //task input
	const addTasks = document.querySelector("#add"); //add task button
	const taskDisplay = document.querySelector(".grid-container"); //task display
	const completedDisplay = document.querySelector(".completed-container"); //completed task display
	const masterRefresh = document.querySelector(".master-refresh"); //master refresh button used to delete all tasks
	// status variables
	const statusCompleted = document.querySelector(".statusCompleted");
	const statusPending = document.querySelector(".statusPending");
	const indicatorText = document.querySelector(".indicator-text");
	// local storage array
	const tasks = JSON.parse(localStorage.getItem("tasks")) || []; //pending tasks
	const completedTasks =
		JSON.parse(localStorage.getItem("completedTasks")) || []; //completed tasks
	//blinking animation variavbles
	const outBeam = document.querySelectorAll(".indicator-beam");

	// DarkMode--Start
	toggleDark.addEventListener("click", () => {
		document.documentElement.classList.add("dark");
		toggleDark.classList.add("hidden");
		toggleLight.classList.remove("hidden");
	});
	toggleLight.addEventListener("click", () => {
		document.documentElement.classList.remove("dark");
		toggleLight.classList.add("hidden");
		toggleDark.classList.remove("hidden");
	});
	// DarkMode---End

	// Adding Task display update Dom
	const updateDOM = () => {
		taskDisplay.innerHTML = "";
		taskDisplayContent = "";
		completedDisplay.innerHTML = "";
		completedDisplayContent = "";
		if (tasks.length === 0) {
			taskDisplayContent += `<div class="col-span-full text-dark1 dark:text-white1 font-main sm:h-[300px] w-full flex flex-col justify-center items-center">
			<p class="text-2xl">No Task Found</p>
			<p class="text-2xl">Add a Task</p>
		</div>`;
		}
		tasks
			.slice()
			.reverse()
			.forEach((task, idx) => {
				taskDisplayContent += `<div class="card text-white  sm:h-[300px]" id="${
					task.id
				}">
								<div class="indexNum">
									<h2 id="${idx}" class="index">${tasks.length - idx}</h2>
								</div>
								<div class="task px-2 py-2 h-full w-full relative">
									<div class="task-text h-full w-full absolute pr-2 pb-4 flex gap-5">
										<span class="flex justify-center w-[25%] h-full">
											<span class="task-word bg-text-gradient1">Task</span>
										</span>
										
										<span class="flex justify-center w-full h-full">
											<span class="input-task ">${task.taskName}</span>
										</span>
									</div>
									
								</div>
								<div class="extension1 flex justify-center items-center h-full w-full">
									<div id="indicatorbeam" class="indicator-beam" dataset-status=${task.status}>
										<div class="in-beam"></div>
									</div>
								</div>
								<div class="buttons flex justify-between items-center group">
									<i data-id="${
										task.id
									}" class="ri-check-double-fill done-btn text-green-400 i-btn  group-hover:blur-sm hover:blur-none"></i>
							
									<i class="ri-delete-bin-2-fill delete-btn text-red-400 i-btn group-hover:blur-sm hover:blur-none" data-id="${
										task.id
									}"></i>
								</div>
								<div id="date-display" class="card-date flex justify-between items-center gap-2 px-3">
									<span class="date-word bg-text-gradient1 ">${task.date}</span>
									<span class="input-date">${task.time}</span>
								</div>
							</div>`;
			});
		taskDisplay.innerHTML = taskDisplayContent;

		if (completedTasks.length === 0) {
			completedDisplayContent += `<div class="col-span-full text-dark1 dark:text-white1 font-main sm:h-[300px] w-full flex flex-col justify-center items-center">
			<p class="text-2xl">No Completed Task Found</p>
			<p class="text-2xl">Complete a Task to see it here</p>
		</div>`;
		}
		completedTasks
			.slice()
			.reverse()
			.forEach((task, idx) => {
				completedDisplayContent += `<div class="card text-white  sm:h-[300px] " id="${
					task.id
				}"> 
								<div class="indexNum">
									<h2 id="${idx}" class="index">${completedTasks.length - idx}</h2>
								</div>
								<div class="task px-2 py-2 h-full w-full relative">
									<div class="task-text h-full w-full absolute pr-2 pb-4 flex gap-5">
										<span class="flex justify-center w-[25%] h-full">
											<span class="task-word bg-text-gradient1">Task</span>
										</span>
										
										<span class="flex justify-center w-full h-full">
											<span class="input-task ">${task.taskName}</span>
										</span>
									</div>
									
								</div>
								<div class="extension1 flex justify-center items-center h-full w-full">
									<div id="indicatorbeam" class="indicator-beam" dataset-status=${task.status}>
										<div class="in-beam"></div>
									</div>
								</div>
								<div class="buttons flex justify-between items-center group">
									
									<i class="ri-reset-left-line  redo-btn text-green-400 i-btn   group-hover:blur-sm hover:blur-none" data-id="${
										task.id
									}"></i>
									<i class="ri-delete-bin-2-fill delete-btn text-red-400 i-btn group-hover:blur-sm hover:blur-none " data-id="${
										task.id
									}"></i>
								</div>
								<div id="date-display" class="card-date flex justify-between items-center gap-2 px-2">
									<span class="date-word bg-text-gradient1 ">${task.date}</span>
									<span class="input-date">${task.time}</span>
								</div>
							</div>`;
			});
		completedDisplay.innerHTML = completedDisplayContent;
	};

	// Adding Completed Task display update Dom using --done-btn
	document.addEventListener("click", (e) => {
		if (e.target.classList.contains("done-btn")) {
			const taskId = e.target.dataset.id;
			const taskIndex = tasks.findIndex((task) => task.id === taskId);
			if (taskIndex === -1) {
				return;
			}
			const task = tasks.splice(taskIndex, 1)[0];
			task.status = "completed";
			completedTasks.push(task);

			localStorage.setItem("tasks", JSON.stringify(tasks));
			localStorage.setItem("completedTasks", JSON.stringify(completedTasks));
			updateDOM();
		}
	});
	//Redo Task using --redo-btn
	document.addEventListener("click", (e) => {
		if (e.target.classList.contains("redo-btn")) {
			const taskId = e.target.dataset.id;
			const taskIndex = completedTasks.findIndex((task) => task.id === taskId);
			if (taskIndex === -1) {
				return;
			}
			const task = completedTasks.splice(taskIndex, 1)[0];
			tasks.push(task);

			localStorage.setItem("tasks", JSON.stringify(tasks));
			localStorage.setItem("completedTasks", JSON.stringify(completedTasks));
			updateDOM();
		}
	});
	// Deleting Task using --delete-btn
	document.addEventListener("click", (e) => {
		if (e.target.classList.contains("delete-btn")) {
			const taskId = e.target.dataset.id;
			const taskIndex = tasks.findIndex((task) => task.id === taskId);
			if (taskIndex !== -1) {
				tasks.splice(taskIndex, 1);
				localStorage.setItem("tasks", JSON.stringify(tasks));
			}
			const completedTasksIndex = completedTasks.findIndex(
				(task) => task.id === taskId
			);
			if (completedTasksIndex !== -1) {
				completedTasks.splice(completedTasksIndex, 1);

				localStorage.setItem("completedTasks", JSON.stringify(completedTasks));
			}

			updateDOM();
		}
	});
	//Delteing all tasks using --master-refresh
	masterRefresh.addEventListener("click", () => {
		refreshWindow.classList.remove("hidden");
		refreshWindow.classList.add("flex");
		document.addEventListener("click", (e) => {
			if (e.target.classList.contains("cancel")) {
				refreshWindow.classList.remove("flex");
				refreshWindow.classList.add("hidden");
			}
			if (e.target.classList.contains("confirm")) {
				refreshWindow.classList.remove("flex");
				refreshWindow.classList.add("hidden");
				localStorage.removeItem("tasks");
				localStorage.removeItem("completedTasks");
				tasks.length = 0;
				completedTasks.length = 0;
				updateDOM();
			}
		});
	});
	// Adding New Task
	addTasks.addEventListener("click", () => {
		const inputValue = taskInput.value;
		const now = new Date();

		// Format: "DD Mon YYYY" (e.g., "19 Mar 2025")
		const formattedDate = now.toLocaleDateString("en-US", {
			day: "2-digit",
			month: "short",
			year: "numeric",
		});

		// Format: "HH:MM AM/PM" (e.g., "09:30 AM")
		const formattedTime = now.toLocaleTimeString("en-US", {
			hour: "2-digit",
			minute: "2-digit",
			hour12: true,
		});

		// console.log(formattedDate, formattedTime);

		if (inputValue === "") {
			taskInput.placeholder = "Please enter a task";
			return;
		}
		const task = {
			id: Date.now().toString(),
			status: "pending",
			taskName: inputValue,
			date: formattedDate,
			time: formattedTime,
		};
		tasks.push(task);
		localStorage.setItem("tasks", JSON.stringify(tasks));
		taskInput.value = "";
		updateDOM();
	});
	updateDOM();

	//glow effect Animations
	outBeam.forEach((beam) => {
		const inBeam = document.querySelectorAll(".in-beam");
		inBeam.forEach((inbeam) => {
			setInterval(() => {
				beam.style.opacity = "0";

				inbeam.style.opacity = "0";
				beam.style.transition = "300ms ease-in-out";
				inbeam.style.transition = "300ms ease-in-out";
				setTimeout(() => {
					beam.style.opacity = "1";
					inbeam.style.opacity = "1";
				}, 500);
			}, 1000);
		});
	});
	//switch between completed section and pending section
	statusCompleted.addEventListener("click", () => {
		indicatorText.textContent = "Completed";
		taskDisplay.style.display = "none";
		completedDisplay.style.display = "grid";
		completedDisplay.style.transition = "300ms ease-in-out";
	});
	statusPending.addEventListener("click", () => {
		indicatorText.textContent = "Pending";
		taskDisplay.style.display = "grid";
		completedDisplay.style.display = "none";
		taskDisplay.style.transition = "1s ease-in-out";
	});
});
