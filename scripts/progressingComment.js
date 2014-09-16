//Global Vars
var poListID = -1;
var enablehighedit = false;
//widgets
var _cancel = mywindow.findChild("_cancel");
var _save = mywindow.findChild("_save");
var _commentText = mywindow.findChild("_commentText"); 

function set(input)
{     
  poListID = input.poListID;
  return true;
}

function saveComment()
{  
  var params = new Object;
  params.poListID = poListID;  
  params.newCommentText = _commentText.plainText; 
  if(params.newCommentText == "")
  {   
   //Warn that the textbox is empty and prevent comment insert
   var CommentResponse = QMessageBox.warning(mywindow, "SAVE COMMENT",
       "Comment Text Box is Empty. <p>Type Comment or Press Cancel");
  }
  else
  { 
      //Give the user a second chance to change the message
      var msgBoxResponse = QMessageBox.warning(mywindow, "SAVE COMMENT",
          "Once this comment is saved it cannot be edited. <p>Do you wish to save ?", 
          QMessageBox.Yes | QMessageBox.No, QMessageBox.No);   
      if(msgBoxResponse == QMessageBox.Yes)    
      { 
         if(params.poListID > 0)
         {
             //insert comment into table      
             var insertqry = toolbox.executeQuery(
              "SELECT postComment(getcmnttypeid('Progressing'), 'P',"
              +" <? value(\"poListID\") ?>, <? value(\"newCommentText\") ?>)"
              +" AS result", params);
               
               if(insertqry.first())
                {
                  //check if a vaild comment ID is return or display error
                  if(insertqry.value("result") < 0)
                  {
                    QMessageBox.critical(mywindow, 
                    "CANNOT POST COMMENT", "A Stored Procedure failed to run "
                    +"properly.");
                  }
                  else
                    mydialog.accept();  
                }              
           }   
           else 
           {
              QMessageBox.critical(mywindow, 
              "CANNOT POST COMMENT", "PO Number Selected is Invaild");
           }           
      }
  }  
}

function enableSave()
{
   _save.setEnabled(true)
}

// Update Query After Selection
_commentText.textChanged.connect(enableSave);
_cancel.clicked.connect(mywindow, "close");
_save.clicked.connect(saveComment);