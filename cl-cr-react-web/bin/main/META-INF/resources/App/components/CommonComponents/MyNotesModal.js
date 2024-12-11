import React, { useEffect, useState } from "react";
import ClayButton from "@clayui/button";

const MyNotesModal = ({ data, notesData, getNotesData }) => {
  const [myNoteModal, setMyNoteModal] = useState(false);
  const [addNotes, setAddNotes] = useState(false);
  const [notesList, setNotesList] = useState([]);
  const [newNoteText, setNewNoteText] = useState("");
  const [noteTextLimit, setNoteTextLimit] = useState("");

  const handleMyNotes = () => {
    getNotesData(data);
    setMyNoteModal(!myNoteModal);
    if (addNotes) {
      setAddNotes(!myNoteModal);
    }
  };

  const handleNotesChange = (e) => {
    const value = e.target.value;
    if (value.length < 101) {
      setNewNoteText(value);
      setNoteTextLimit("");
    } else {
      setNoteTextLimit("Maximum 100 characters are accepted");
    }
  };

  const handleAddNotes = async () => {
    var requestUrl = "/o/mygsb/gsb/clce/add-notes?p_auth=" + Liferay.authToken;
    var requestHeaders = new Headers({
      Accept: "application/json",
      "Content-Type": "application/json",
    });
    var payload = {
      class_id: data.classId,
      note: newNoteText,
    };
    await fetch(requestUrl, {
      method: "post",
      headers: requestHeaders,
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((userData) => {
        setNewNoteText("");
        setAddNotes(!addNotes);
        setMyNoteModal(true);
        getNotesData(data);
        window.myNoteData();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleCancelAddNotes = () => {
    setNewNoteText("");
    setAddNotes(!addNotes);
    setMyNoteModal(true);
    getNotesData(data);
    window.myNoteData();
  };

  const handleDeleteNotes = async (id) => {
    var requestUrl =
      "/o/mygsb/gsb/clce/delete-notes?id=" +
      id +
      "&p_auth=" +
      Liferay.authToken;
    var requestHeaders = new Headers({
      Accept: "application/json",
    });
    await fetch(requestUrl, {
      method: "delete",
      headers: requestHeaders,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((userData) => {
        getNotesData(data);
        window.myNoteData();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const perpareNotesData = (notesdata) => {
    const calculateRelativeTime = (dateTime) => {
      const convertToLocal = (dateTime) => {
        const serverOffset = -240;
        const givenDate = new Date(dateTime);
        const incomingOffset = givenDate.getTimezoneOffset();
        if (serverOffset === incomingOffset) return givenDate;
        const outGoingDate = new Date(
          givenDate.getTime() + (serverOffset - incomingOffset) * 60 * 1000
        );
        if (givenDate.getHours() !== outGoingDate.getHours()) {
          const difference = Math.abs(serverOffset - incomingOffset);
          let hours = outGoingDate.getHours() + difference / 60;
          hours += 12;
          outGoingDate.setHours(hours);
        }
        return outGoingDate;
      };

      const givenDate = convertToLocal(dateTime);
      const timeDiff = new Date() - givenDate;
      const seconds = Math.floor(timeDiff / 1000);
      const minutesDifference = Math.floor(seconds / 60);

      if (minutesDifference < 1) {
        return "just now";
      } else if (minutesDifference === 1) {
        return "1 minute ago";
      } else if (minutesDifference < 60) {
        return `${minutesDifference} minutes ago`;
      } else {
        const hours = Math.floor(minutesDifference / 60);
        if (hours === 1) {
          return "1 hour ago";
        } else if (hours < 24) {
          return `${hours} hours ago`;
        } else {
          const days = Math.floor(hours / 24);
          if (days === 1) {
            return "1 day ago";
          } else {
            return `${days} days ago`;
          }
        }
      }
    };

    notesdata.forEach((item) => {
      item.relativeTime = calculateRelativeTime(item.datetime);
    });
    setNotesList([...notesdata].reverse());
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (myNoteModal && !event.target.closest(".my-notes-popup")) {
        setMyNoteModal(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [myNoteModal]);

  useEffect(() => {
    perpareNotesData(notesData);
  }, [notesData]);

  return (
    <>
      <ClayButton
        className="note-btn"
        displayType={null}
        onClick={handleMyNotes}
      >
        <span className="inline-item inline-item-before">
          {notesData?.length > 0 ? (
            <img
              alt="Note"
              src={"/o/stanford-clce-theme/images/icons/note_fill_icon.svg"}
            />
          ) : (
            <img
              alt="Note"
              src={"/o/stanford-clce-theme/images/icons/note_line_icon.svg"}
            />
          )}
        </span>
        {"My Notes"}
      </ClayButton>
      {myNoteModal && !addNotes ? (
        <div
          className="my-notes-popup"
          id="my-notes-popup"
          style={{ top: "35px" }}
        >
          <button
            className="my-notes-popup-add-button"
            onClick={() => setAddNotes(!addNotes)}
          >
            <div>Add Notes</div>
            <div>
              <img
                alt="Add Notes"
                src={"/o/stanford-clce-theme/images/icons/add-icon-red.svg"}
              />
            </div>
          </button>
          <div className="border-line"></div>
          {notesList?.length > 0 ? (
            notesList.map((note, index) => {
              return (
                <>
                  <div className="my-notes-title-container" key={note.id}>
                    <div
                      className="my-notes-title"
                      style={{ justifyContent: "space-between" }}
                    >
                      <div
                        style={{
                          display: " -webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          marginBottom: "5px",
                        }}
                      >
                        {note.note}
                      </div>
                      <div
                        className="my-notes-delete"
                        onClick={() => handleDeleteNotes(note.id)}
                        style={{ cursor: "pointer" }}
                      >
                        <img
                          src={
                            "/o/stanford-clce-theme/images/icons/delete-icon.svg"
                          }
                          alt="delete"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="my-notes-title-footer">
                        <div>
                          <img
                            src="/o/stanford-clce-theme/images/icons/time-icon.svg"
                            alt="time"
                          />
                        </div>
                        <div>{note.relativeTime}</div>
                      </div>
                    </div>
                  </div>
                  <div className="border-line"></div>
                </>
              );
            })
          ) : (
            <div className="my-notes-title-container">
              You have not added any notes for this course yet. Click on 'Add
              Notes' to get started.
            </div>
          )}
        </div>
      ) : (
        addNotes && (
          <div
            className="my-notes-popup"
            id="my-notes-popup"
            style={{ top: "35px" }}
          >
            <div className="my-notes-add-notes">
              <input
                type="text"
                className="my-notes-input"
                placeholder="Enter your note here..."
                value={newNoteText}
                onChange={(e) => handleNotesChange(e)}
                autoFocus="autofocus"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAddNotes();
                  }
                }}
                maxLength={101}
              />
            </div>
            <div className="border-line"></div>
            <div>{noteTextLimit && <>{noteTextLimit}</>}</div>
            <div className="my-notes-add-notes-btn">
              <button
                className="my-notes-add-notes-cancelbtn"
                onClick={handleCancelAddNotes}
              >
                Cancel
              </button>
              <button
                className="my-notes-add-notes-savebtn"
                onClick={handleAddNotes}
              >
                Save
              </button>
            </div>
          </div>
        )
      )}
    </>
  );
};

export default MyNotesModal;
