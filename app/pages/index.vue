<script setup>
import initialWorkshops from "~/assets/data/workshops.json";

const workshops = ref(
  initialWorkshops.map((w) => ({
    ...w,
    id: w.id || Date.now() + Math.random(),
  }))
);

const isModalOpen = ref(false);
const modalType = ref("add"); // 'add' or 'edit'
const selectedWorkshop = ref(null);

const workshopForm = ref({
  date: "",
  title: "",
  time: "",
  location: "",
  recordingLink: "",
  note: "",
  description: "",
  presenter: "",
});

const route = useRoute();
const rc = useRuntimeConfig();
const EDITING_CODE = rc.public.EDITING_CODE || "";

const isEditingMode = computed(() => route.query.code === EDITING_CODE);

const openAddModal = () => {
  modalType.value = "add";
  selectedWorkshop.value = null;
  workshopForm.value = {
    date: "",
    title: "",
    time: "",
    location: "",
    recordingLink: "",
    note: "",
    description: "",
    presenter: "",
  };
  isModalOpen.value = true;
};

const openEditModal = (workshop) => {
  modalType.value = "edit";
  selectedWorkshop.value = workshop;
  workshopForm.value = { ...workshop };
  isModalOpen.value = true;
};

const saveWorkshop = () => {
  if (modalType.value === "add") {
    const newWorkshop = {
      ...workshopForm.value,
      id: Date.now() + Math.random(),
    };
    workshops.value.push(newWorkshop);
  } else if (modalType.value === "edit") {
    const index = workshops.value.findIndex(
      (w) => w.id === selectedWorkshop.value.id
    );
    if (index !== -1) {
      workshops.value[index] = {
        ...workshopForm.value,
        id: selectedWorkshop.value.id,
      };
    }
  }
  isModalOpen.value = false;
};

const deleteWorkshop = (workshopToDelete) => {
  if (confirm(`Are you sure you want to delete "${workshopToDelete.title}"?`)) {
    workshops.value = workshops.value.filter(
      (w) => w.id !== workshopToDelete.id
    );
  }
};

const closeModal = () => {
  isModalOpen.value = false;
};
</script>

<template>
  <div class="container mx-auto p-4">
    <p class="mb-6 text-lg">
      This is a list of workshops offered to EPCS 2200 and EPCS 3200 students.
      This list is updated when workshops are added or dates change. Please
      check this page often.
    </p>

    <!-- Add New Workshop button - only visible in editing mode -->
    <div v-if="isEditingMode" class="mb-4 flex justify-end">
      <button
        @click="openAddModal"
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <svg
          class="-ml-1 mr-2 h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-11.25a.75.75 0 00-1.5 0v2.5h-2.5a.75.75 0 000 1.5h2.5v2.5a.75.75 0 001.5 0v-2.5h2.5a.75.75 0 000-1.5h-2.5v-2.5z"
            clip-rule="evenodd"
          />
        </svg>
        Add New Workshop
      </button>
    </div>

    <div class="overflow-x-auto shadow-md sm:rounded-lg">
      <table
        class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
      >
        <thead
          class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
        >
          <tr>
            <th scope="col" class="px-6 py-3">Date</th>
            <th scope="col" class="px-6 py-3">Title</th>
            <th scope="col" class="px-6 py-3">Time</th>
            <th scope="col" class="px-6 py-3">Location</th>
            <th scope="col" class="px-6 py-3">Recording Link</th>
            <th scope="col" class="px-6 py-3">Note</th>
            <th scope="col" class="px-6 py-3">Workshop Description</th>
            <th scope="col" class="px-6 py-3">Presenter</th>
            <!-- Actions column only visible in editing mode -->
            <th v-if="isEditingMode" scope="col" class="px-6 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="workshop in workshops"
            :key="workshop.id"
            class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
          >
            <td
              class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
            >
              {{ workshop.date }}
            </td>
            <td class="px-6 py-4">{{ workshop.title }}</td>
            <td class="px-6 py-4">{{ workshop.time }}</td>
            <td class="px-6 py-4">{{ workshop.location }}</td>
            <td class="px-6 py-4">
              <a
                v-if="
                  workshop.recordingLink &&
                  workshop.recordingLink.startsWith('http')
                "
                :href="workshop.recordingLink"
                target="_blank"
                class="text-blue-600 hover:underline"
                >Link</a
              >
              <span v-else>{{ workshop.recordingLink }}</span>
            </td>
            <td class="px-6 py-4">{{ workshop.note }}</td>
            <td class="px-6 py-4">{{ workshop.description }}</td>
            <td class="px-6 py-4">{{ workshop.presenter }}</td>
            <!-- Edit/Delete buttons only visible in editing mode -->
            <td
              v-if="isEditingMode"
              class="px-6 py-4 flex items-center space-x-2"
            >
              <button
                @click="openEditModal(workshop)"
                class="inline-flex items-center p-1.5 border border-transparent rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                aria-label="Edit"
                title="Edit"
              >
                <svg
                  class="h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    d="M5.433 13.917l1.326-4.508a.75.75 0 011.174-.298l.635.635a.75.75 0 001.06-.006l6.762-6.762a.75.75 0 00-1.06-1.06L9.605 10.04a.75.75 0 00-.006 1.06l.635.635a.75.75 0 01-.298 1.174l-4.508 1.326a.75.75 0 01-.913-.913zM6.5 16.5H4.25A2.25 2.25 0 012 14.25V4.75A2.25 2.25 0 014.25 2.5h9.5A2.25 2.25 0 0116 4.75v2.25a.75.75 0 001.5 0V4.75A3.75 3.75 0 0013.75 1H4.25A3.75 3.75 0 00.5 4.75v9.5A3.75 3.75 0 004.25 18.5h2.25a.75.75 0 000-1.5z"
                  />
                </svg>
              </button>
              <button
                @click="deleteWorkshop(workshop)"
                class="inline-flex items-center p-1.5 border border-transparent rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                aria-label="Delete"
                title="Delete"
              >
                <svg
                  class="h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.58.274-2.333.586a.75.75 0 00-.737 1.107L4.547 9.5H15.453l1.838-3.614a.75.75 0 00-.737-1.107c-.753-.312-1.538-.509-2.333-.586V3.75C14 2.134 12.866 1 11.25 1h-2.5zM10 11.25a.75.75 0 00-1.5 0v3.5a.75.75 0 001.5 0v-3.5z"
                    clip-rule="evenodd"
                  />
                  <path
                    fill-rule="evenodd"
                    d="M4.505 11.147A.75.75 0 004 11.75v2.5c0 .138-.112.25-.25.25H2.75a.75.75 0 00-.75.75v.5c0 .414.336.75.75.75h14.5a.75.75 0 00.75-.75v-.5a.75.75 0 00-.75-.75h-1a.25.25 0 01-.25-.25v-2.5a.75.75 0 00-.455-.603L12.5 9h-5L4.505 11.147zM6.5 11.25a.75.75 0 00-1.5 0v3.5a.75.75 0 001.5 0v-3.5z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Custom Modal Overlay and Content -->
    <div
      v-if="isModalOpen"
      class="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4"
    >
      <div
        class="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full p-6"
      >
        <!-- Modal Header -->
        <div
          class="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700"
        >
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ modalType === "add" ? "Add New Workshop" : "Edit Workshop" }}
          </h3>
          <button
            @click="closeModal"
            class="p-1 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            aria-label="Close"
          >
            <svg
              class="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <!-- Workshop Form -->
        <form @submit.prevent="saveWorkshop" class="space-y-4 pt-4">
          <div>
            <label
              for="date"
              class="block text-sm font-medium text-gray-700 dark:text-gray-200"
              >Date</label
            >
            <input
              type="text"
              id="date"
              v-model="workshopForm.date"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div>
            <label
              for="title"
              class="block text-sm font-medium text-gray-700 dark:text-gray-200"
              >Title</label
            >
            <input
              type="text"
              id="title"
              v-model="workshopForm.title"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div>
            <label
              for="time"
              class="block text-sm font-medium text-gray-700 dark:text-gray-200"
              >Time</label
            >
            <input
              type="text"
              id="time"
              v-model="workshopForm.time"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div>
            <label
              for="location"
              class="block text-sm font-medium text-gray-700 dark:text-gray-200"
              >Location</label
            >
            <input
              type="text"
              id="location"
              v-model="workshopForm.location"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div>
            <label
              for="recordingLink"
              class="block text-sm font-medium text-gray-700 dark:text-gray-200"
              >Recording Link</label
            >
            <input
              type="text"
              id="recordingLink"
              v-model="workshopForm.recordingLink"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div>
            <label
              for="note"
              class="block text-sm font-medium text-gray-700 dark:text-gray-200"
              >Note</label
            >
            <textarea
              id="note"
              v-model="workshopForm.note"
              rows="3"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            ></textarea>
          </div>

          <div>
            <label
              for="description"
              class="block text-sm font-medium text-gray-700 dark:text-gray-200"
              >Workshop Description</label
            >
            <textarea
              id="description"
              v-model="workshopForm.description"
              rows="3"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            ></textarea>
          </div>

          <div>
            <label
              for="presenter"
              class="block text-sm font-medium text-gray-700 dark:text-gray-200"
              >Presenter</label
            >
            <input
              type="text"
              id="presenter"
              v-model="workshopForm.presenter"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div class="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              @click="closeModal"
              class="inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {{ modalType === "add" ? "Add Workshop" : "Save Changes" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
