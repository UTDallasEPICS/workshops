<script setup>
import initialWorkshops from "~/assets/data/workshops.json";
import rsvpData from "~/assets/data/rsvp.json"; // Import RSVP data

const workshops = ref(
  initialWorkshops.map((w) => ({
    ...w,
    id: w.id || Date.now() + Math.random(),
  }))
);

// Convert RSVP data into a more usable format (e.g., array of names)
const rsvps = computed(() => {
  const processedRsvps = {};
  for (const title in rsvpData) {
    if (Object.prototype.hasOwnProperty.call(rsvpData, title)) {
      processedRsvps[title] = rsvpData[title]
        .split(",")
        .map((name) => name.trim())
        .filter((name) => name.length > 0);
    }
  }
  return processedRsvps;
});

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
            <th scope="col" class="px-6 py-3">RSVP</th>
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
            <td class="px-6 py-4">
              <div
                v-if="rsvps[workshop.title] && rsvps[workshop.title].length > 0"
              >
                <template
                  v-for="(attendee, idx) in rsvps[workshop.title]"
                  :key="attendee"
                >
                  {{ attendee }}
                  <span v-if="idx < rsvps[workshop.title].length - 1">, </span>
                </template>
              </div>
              <span v-else class="text-gray-400">N/A</span>
            </td>

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
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="size-4"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
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
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="size-4"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
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
