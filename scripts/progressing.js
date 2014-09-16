var _allDueRB = mywindow.findChild("_allDueRB");
var _allOrderRB = mywindow.findChild("_allOrderRB");
var _close = mywindow.findChild("_close");
var _collapse = mywindow.findChild("_collapse"); 
var _commentDateValue = mywindow.findChild("_commentDateValue");
var _commentPOValue = mywindow.findChild("_commentPOValue");
var _commentText = mywindow.findChild("_commentText");
var _commentVendValue = mywindow.findChild("_commentVendValue");
var _expCode = mywindow.findChild("_expCode");
var _expCodeFree = mywindow.findChild("_expCodeFree");
var _dueDateGroupBox = mywindow.findChild("_dueDateGroupBox");
var _dueDateBack = mywindow.findChild("_dueDateBack");
var _dueDateChanged = mywindow.findChild("_dueDateChanged");
var _dueDateRB = mywindow.findChild("_dueDateRB");
var _dueIn2WeeksRB = mywindow.findChild("_dueIn2WeeksRB");
var _expand = mywindow.findChild("_expand");
var _formatGroupBox = mywindow.findChild("_formatGroupBox");
var _itemByVendorRB = mywindow.findChild("_itemByVendorRB");
var _ItemsByPORB = mywindow.findChild("_ItemsByPORB");
var _new = mywindow.findChild("_new");
var _next = mywindow.findChild("_next");
var _order2weekRB = mywindow.findChild("_order2weekRB");
var _orderDateGroupBox = mywindow.findChild("_orderDateGroupBox");
var _orderDateBack = mywindow.findChild("_orderDateBack");
var _orderDateRB = mywindow.findChild("_orderDateRB");
var _overdueRB = mywindow.findChild("_overdueRB");
var _prev = mywindow.findChild("_prev");
var _print = mywindow.findChild("_print");
var _ProgressingList = mywindow.findChild("_ProgressingList");
var _page =  mywindow.findChild("_page");
var _pages =  mywindow.findChild("_pages");
var _query = mywindow.findChild("_query");
var _userValue = mywindow.findChild("_userValue"); 
var _reqUserName = mywindow.findChild("_reqUserName"); 
var _useExpCode = mywindow.findChild("_useExpCode"); 
var _useExpCodeFree = mywindow.findChild("_useExpCodeFree"); 
var _woCB = mywindow.findChild("_woCB"); 
       
//Public Fields
var enableCommentEdit;
var enableViewPO;
var enableEditPO;
var commentqry;

//Parameter Object
function getParams()
{
  // create an object hold the parameters
  var params = new Object; 
  //Due Date Filters  
  if(_allDueRB.checked)
     params.alldue = true;      
  else if(_overdueRB.checked)
     params.overdue = true;     
  else if(_dueIn2WeeksRB.checked)
     params.duein2weeks = true;  
  else if(_dueDateChanged.checked)
     params.dueDateChanged = true;  
  else if(_dueDateRB.checked)
  {  
     params.duedatestart = _dueDateBack.startDate;        
     params.duedateend = _dueDateBack.endDate;     
  }   

  //Order Date Filters
  if(_allOrderRB.checked)
      params.allorders = true;     
  else if(_order2weekRB.checked)
      params.order2weeks = true;     
  else if(_orderDateRB.checked)
  {    
     params.orderdatestart = _orderDateBack.startDate;  
     params.orderdateend = _orderDateBack.endDate; 
  }

 if(_woCB.id() > -1)
   params.woID = _woCB.id();

 if(_reqUserName.text != "")
    params.username = _reqUserName.text;

  if(_expCode.id() > -1 && _useExpCode.checked)
     params.expcatid = _expCode.id();

  if(_expCodeFree.text != "" && _useExpCodeFree.checked)
     params.expcattext = _expCodeFree.text
  // return the params object    
  return params;
}


function set(input)
{
    if(input.creatinguser)
    {          
        _reqUserName.text = input.creatinguser;           
    }
}



//This function gets all comment for a PO and display the latest in
//the text edit box
function fillCommentDetails()
{
     // create an object hold the parameters
     var params = new Object;
     params.poListID =_ProgressingList.id();
     //if a vaild PO ID & comment edit is enabled enable new button
     //Infomation on the PO and comments are displayed
     if(params.poListID > 0 )
     {
        _new.enabled = enableCommentEdit;
        // This query gets progressing comment for the list box line PO
        // a comment type 'progressing' must be created for this to work
        commentqry = toolbox.executeQuery(
           " SELECT comment_source_id,"     
           +" comment_date,"
           +" comment_user,"
           +" comment_text"
           +" FROM comment"
           +" INNER JOIN cmnttype ON cmnttype.cmnttype_id = comment.comment_cmnttype_id"           
           +" WHERE lower(cmnttype_name) = 'progressing'"
           +" AND comment_source = 'P'"
           +"  AND comment_source_id = <? value(\"poListID\") ?>"
           +" ORDER BY comment_date DESC", params);    
        //load textedit and labels with data
        if(commentqry.first())
        {       
             //count how many comment rows there are
             var commentcount = toolbox.executeQuery(
               " SELECT count(comment_source_id) AS rownum "
              +" FROM comment"
              +" INNER JOIN cmnttype ON cmnttype.cmnttype_id = comment.comment_cmnttype_id"           
              +" WHERE comment_cmnttype_id = getcmnttypeid('Progressing')"
              +"   AND comment_source = 'P'"
              +"   AND comment_source_id = <? value(\"poListID\") ?>", params);
             if(commentcount.first())             
               _pages.value = commentcount.value("rownum");             
             else
               _pages = 1; 
            _page.value = _pages.value;
            _commentDateValue.text = commentqry.value("comment_date");
            _userValue.text = commentqry.value("comment_user");
            _commentText.setText(commentqry.value("comment_text"));        
        }   
        else
        {        
            _commentDateValue.clear();
            _userValue.clear(); 
            _commentText.clear();
            _page.value = 1;
            _pages.value = 1;   
        }
        //Get info on PO and display it in labels    
        var poheadqry = toolbox.executeQuery(
        " SELECT "
        +" pohead_number,"
        +" vend_name"    
        +" FROM pohead"
        +" INNER JOIN vendinfo ON pohead.pohead_vend_id = vendinfo.vend_id"
        +" WHERE pohead_id = <? value(\"poListID\") ?>", params);
        if(poheadqry.first())
        {
            _commentPOValue.text = poheadqry.value("pohead_number");
            _commentVendValue.text = poheadqry.value("vend_name");             
        }   
        else
        {
            _commentPOValue.clear();
            _commentVendValue.clear();        
        }  
     }
     else
     {
         _new.enabled = false;
         _commentPOValue.clear();
         _commentVendValue.clear();
         _commentDateValue.clear();
         _userValue.clear(); 
         _commentText.clear(); 
         _page.value = 1;
         _pages.value = 1;   
     }   
    //if more than one note exists enable next/prev buttons
    if(commentqry.size() > 1 &&
       params.poListID > 0)
    {
        _next.enabled = true;
        _prev.enabled = true;
    } 
    else
    {
        _next.enabled = false;
        _prev.enabled = false;
    }               
}

function newComment()
{  
  // pass NonModal and Window, both of which should be modified by the toolbox for a QDialog
  var childwnd = toolbox.openWindow("progressingComment", mywindow, Qt.WindowModal, 1);
  // create a ParameterList to set the address id and whether the dialog
  // should open for editing or viewing
  var params = new Object;
  params.poListID = _ProgressingList.id();  
  var tmp = toolbox.lastWindow().set(params);
  // exec() the QDialog
  var execval = childwnd.exec();
  // refill the list when the dialog is done exec()uting
  fillCommentDetails();
}

function nextComment()
{
  //move to next comment
   if(commentqry.size() > 1)
   {
        if(commentqry.next())
        {         
            _commentDateValue.text = commentqry.value("comment_date");
            _userValue.text = commentqry.value("comment_user");
            _commentText.setText(commentqry.value("comment_text"));
            if(_page.value > 1)                     
               _page.value = _page.value - 1;                          
            else
               _page.value = 1; 
        }   
        else
        {
             if(commentqry.last())
             {
                _commentDateValue.text = commentqry.value("comment_date");
                _userValue.text = commentqry.value("comment_user");
                _commentText.setText(commentqry.value("comment_text"));
                _page.value = 1; 
             }
             else
             {              
                _commentDateValue.clear();
                _userValue.clear(); 
                _commentText.clear();
                _page.value = 1;   
             }   
        }
   } 

}
function previousComment()
{
  //move to previous comment
  if(commentqry.size() > 1)
   {
     if(commentqry.previous())
     {       
        _commentDateValue.text = commentqry.value("comment_date");
        _userValue.text = commentqry.value("comment_user");
        _commentText.setText(commentqry.value("comment_text"));
        if(_page.value >= _pages.value)
           _page.value = _pages.value;
        else                                      
           _page.value = _page.value + 1;  
     }   
     else
     {
        if(commentqry.first())
        {         
          _commentDateValue.text = commentqry.value("comment_date");
          _userValue.text = commentqry.value("comment_user");
          _commentText.setText(commentqry.value("comment_text")); 
          _page.value = _pages.value;
        }
        else
        {       
            _commentDateValue.clear();
            _userValue.clear(); 
            _commentText.clear(); 
            _page.value = _pages.value;  
        }
     }
   } 
}

// This function executes a query and passes the results of that query
// to the list object for populating the list.
function querybyvendor()
{ 
 // get a copy of the params from the getParams function.
  var params = getParams();     
  var qry = toolbox.executeQuery(   
     "  SELECT DISTINCT"
     +"   pohead_id AS rowid,"
     +"   poitem_id AS itemid, "   
     +"   vend_id,"
     +"   vend_number,"
     +"   vend_name,"
     +"   text(pohead_number) AS ponumber,"
     +"   text(poitem_linenumber) AS poline,"
     +"   item_number AS vendcode_itemnumber,"
     +"   pohead_orderdate AS ordereddate,"
     +"   poitem_duedate AS duedate,"
     +"   poitem_rlsd_duedate AS orignalduedate, "
     +"   CASE"
     +"     WHEN (LENGTH(TRIM(BOTH '	' FROM poitem_vend_item_descrip)) > 0) THEN (poitem_vend_item_descrip)"
     +"     WHEN (LENGTH(TRIM(BOTH '	' FROM item_descrip1)) > 0) THEN (item_descrip1 || ' ' || item_descrip2)"
     +"    ELSE (poitem_comments)"
     +"   END AS vendname_desc,"
     +"   poitem_vend_item_number AS venditemnum,"
     +"   CASE WHEN (poitem_vend_uom LIKE '') THEN (uom_name)"
     +"        ELSE (poitem_vend_uom)"
     +"   END AS uomname,"
     +"  trim(BOTH ' ' FROM to_char(poitem_qty_received - poitem_qty_returned, '9999999999.99')) AS cntname_qtyrecv,"
     +"  trim(BOTH ' ' FROM to_char(poitem_qty_ordered, '9999999999.99')) AS tel_qtyordered,"
     +"  curr_symbol ||  trim(BOTH ' ' FROM to_char(poitem_unitprice, '9999999999.99999')) AS email_cost,"
     +"  curr_symbol ||  trim(BOTH ' ' FROM to_char(poitem_unitprice * poitem_qty_ordered, '9999999999.99')) AS extcost,"
     +"   CASE WHEN COALESCE(expcat_code, prj_number) ISNULL THEN 'INV' "
     +"        ELSE COALESCE(expcat_code, prj_number) END AS expcode, "
     +"   1 as xtindentrole,"
     +"   CASE WHEN (poitem_qty_received - poitem_qty_returned <= 0) THEN 'warning' ELSE null END AS cntname_qtyrecv_qtforegroundrole,"
     +"   CASE WHEN (poitem_duedate < current_date) THEN 'error' ELSE null END AS duedate_qtforegroundrole,"
     +"   (null) AS qtbackgroundrole"
     +" FROM poitem"
     +"  INNER JOIN pohead ON pohead.pohead_id = poitem.poitem_pohead_id"
     +"  INNER JOIN vendinfo ON vendinfo.vend_id = pohead.pohead_vend_id"
     +"  INNER JOIN curr_symbol ON pohead.pohead_curr_id = curr_symbol.curr_id"     
     +"  LEFT OUTER JOIN cntct ON cntct.cntct_id = vendinfo.vend_cntct1_id"
     +"  LEFT OUTER JOIN itemsite ON poitem_itemsite_id = itemsite_id"
     +"  LEFT OUTER JOIN (item JOIN uom ON (item_inv_uom_id=uom_id)) ON (itemsite_item_id = item_id)"
     +"  LEFT OUTER JOIN expcat ON expcat.expcat_id = poitem.poitem_expcat_id "
     +"  LEFT OUTER JOIN prj ON prj_id = poitem_prj_id "
     +" WHERE pohead_status = 'O'"
     +"  AND poitem_status = 'O'"
     +"  AND poitem_qty_received - poitem_qty_returned < poitem_qty_ordered"         
     +" <? if exists(\"overdue\") ?>"      
     +"    AND poitem_duedate < current_date" 
     +" <? elseif exists(\"duein2weeks\") ?>"      
     +"    AND poitem_duedate BETWEEN date(current_date)"
     +"    AND date(current_date + 14)"
     +" <? elseif exists(\"dueDateChanged\") ?>"      
     +"    AND NOT poitem_rlsd_duedate = poitem_duedate "
     +" <? elseif exists(\"duedatestart\") ?>" 
     +"    AND poitem_duedate BETWEEN date(<? value(\"duedatestart\") ?>)"
     +"    AND date(<? value(\"duedateend\") ?>)"       
     +" <? endif ?>" 
     +" <? if exists(\"order2weeks\") ?>" 
     +"    AND pohead_orderdate < date(current_date - 14)" 
     +" <? elseif exists(\"orderdatestart\") ?>" 
     +"    AND pohead_orderdate BETWEEN date(<? value(\"orderdatestart\") ?>)"
     +"    AND date(<? value(\"orderdateend\") ?>)"
     +" <? endif ?>" 
     +" <? if exists(\"expcatid\") ?> " 
     +"    AND poitem_expcat_id = <? value(\"expcatid\") ?> "        
     +" <? endif ?>"
     +" <? if exists(\"expcattext\") ?> " 
     +"    AND COALESCE(expcat_code, prj_number) LIKE <? value(\"expcattext\") ?>  || '%' " 
     +" <? endif ?>"
     +" <? if exists(\"username\") ?> "  
     +"    AND poitem_id IN (SELECT poreqitem_poitem_id "
     +"                        FROM poreq.poreqitem, poreq.poreqhead "
     +"                       WHERE poreqitem_poreqhead_id = poreqhead_id "
     +"                         AND poreqhead_username = <? value(\"username\") ?>) "
     +" <? endif ?>"
     +" <? if exists(\"woID\") ?> " 
     +"    AND itemsite_id IN (SELECT itemsite_id "
     +"                     FROM womatl, itemsite "
     +"                    WHERE itemsite_id = womatl_itemsite_id "  
     +"                      AND ((itemsite_qtyonhand - qtyAllocated(itemsite_id, womatl_duedate)) < 0 "
     +"                       OR  (itemsite_qtyonhand - " 
     +"                            noNeg(itemuomtouom(itemsite_item_id, womatl_uom_id, NULL, womatl_qtyreq - " 
     +"                            womatl_qtyiss))) < 0) "     
     +"                      AND womatl_wo_id = <? value(\"woID\") ?>) "
     +" <? endif ?>"
     +" UNION"
     +"  SELECT *"
     +"  FROM("   
     +"  SELECT DISTINCT"
     +"   -1 AS rowid,"
     +"   -1 AS itemid, "   
     +"   vend_id,"
     +"   vend_number,"     
     +"   vend_name,"
     +"   text('') AS ponumber,"
     +"   text('') AS poline,"
     +"   vend_number AS vendcode_itemnumber,"
     +"   min(pohead_orderdate) AS ordereddate,"
     +"   min(poitem_duedate) AS duedate,"
     +"   min(poitem_rlsd_duedate) AS orignalduedate, "
     +"   text(vend_name) AS vendname_desc,"
     +"   text(' ') AS venditemnum,"
     +"   text('') AS uomname,"
     +"   text(cntct_first_name || ' ' || cntct_last_name) AS cntname_qtyrecv,"
     +"   text(cntct_phone) AS tel_qtyordered, text(cntct_email) AS email_cost,"
     +"   curr_symbol ||  trim(BOTH ' ' FROM to_char(sum(poitem_unitprice * poitem_qty_ordered), '9999999999.99')) AS extcost,"
     +"   text('') AS expcode, "
     +"   0 as xtindentrole,"
     +"   (null) AS cntname_qtyrecv_qtforegroundrole,"
     +"   (null) AS duedate_qtforegroundrole,"
     +"   text('lightskyblue') AS qtbackgroundrole"
     +"  FROM poitem"
     +"   INNER JOIN pohead ON pohead.pohead_id = poitem.poitem_pohead_id"
     +"   INNER JOIN vendinfo ON vendinfo.vend_id = pohead.pohead_vend_id"  
     +" INNER JOIN curr_symbol ON pohead.pohead_curr_id = curr_symbol.curr_id"     
     +"   LEFT OUTER JOIN cntct ON cntct.cntct_id = vendinfo.vend_cntct1_id"
     +"   LEFT OUTER JOIN itemsite ON poitem_itemsite_id = itemsite_id"
     +"   LEFT OUTER JOIN (item JOIN uom ON (item_inv_uom_id=uom_id)) ON (itemsite_item_id = item_id)"
     +"   LEFT OUTER JOIN expcat ON expcat.expcat_id = poitem.poitem_expcat_id "
     +"   LEFT OUTER JOIN prj ON prj_id = poitem_prj_id "
     +" WHERE pohead_status = 'O'"
     +"  AND poitem_status = 'O'"
     +"  AND poitem_qty_received - poitem_qty_returned < poitem_qty_ordered"
     +" <? if exists(\"overdue\") ?>"      
     +"    AND poitem_duedate < current_date" 
     +" <? elseif exists(\"duein2weeks\") ?>"      
     +"    AND poitem_duedate BETWEEN date(current_date)"
     +"    AND date(current_date + 14)"
     +" <? elseif exists(\"dueDateChanged\") ?>"      
     +"    AND NOT poitem_rlsd_duedate = poitem_duedate "
     +" <? elseif exists(\"duedatestart\") ?>" 
     +"    AND poitem_duedate BETWEEN date(<? value(\"duedatestart\") ?>)"
     +"    AND date(<? value(\"duedateend\") ?>)"       
     +" <? endif ?>" 
     +" <? if exists(\"order2weeks\") ?>" 
     +"    AND pohead_orderdate < date(current_date - 14)" 
     +" <? elseif exists(\"orderdatestart\") ?>" 
     +"    AND pohead_orderdate BETWEEN date(<? value(\"orderdatestart\") ?>)"
     +"    AND date(<? value(\"orderdateend\") ?>)"       
     +" <? endif ?>"
     +" <? if exists(\"expcatid\") ?> " 
     +"    AND poitem_expcat_id = <? value(\"expcatid\") ?> "        
     +" <? endif ?> " 
     +" <? if exists(\"expcattext\") ?> " 
     +"    AND COALESCE(expcat_code, prj_number) LIKE <? value(\"expcattext\") ?>  || '%' " 
     +" <? endif ?>"
     +" <? if exists(\"username\") ?> "  
     +"    AND poitem_id IN (SELECT poreqitem_poitem_id "
     +"                        FROM poreq.poreqitem, poreq.poreqhead "
     +"                       WHERE poreqitem_poreqhead_id = poreqhead_id "
     +"                         AND poreqhead_username = <? value(\"username\") ?>) "
     +" <? endif ?>"   
     +" <? if exists(\"woID\") ?> " 
     +"    AND itemsite_id IN (SELECT itemsite_id "
     +"                     FROM womatl, itemsite "
     +"                    WHERE itemsite_id = womatl_itemsite_id "  
     +"                      AND ((itemsite_qtyonhand - qtyAllocated(itemsite_id, womatl_duedate)) < 0 "
     +"                       OR  (itemsite_qtyonhand - " 
     +"                            noNeg(itemuomtouom(itemsite_item_id, womatl_uom_id, NULL, womatl_qtyreq - " 
     +"                            womatl_qtyiss))) < 0) "     
     +"                      AND womatl_wo_id = <? value(\"woID\") ?>) "
     +" <? endif ?>"
     +" GROUP BY vend_id, vend_number, vend_name,"
     +"  ponumber, poline, vendcode_itemnumber,"
     +"  vendname_desc, venditemnum, "
     +"  uomname, cntname_qtyrecv, tel_qtyordered,"
     +"  curr_symbol, expcode, email_cost, xtindentrole,"
     +"  cntname_qtyrecv_qtforegroundrole," 
     +"  duedate_qtforegroundrole, qtbackgroundrole"
     +"       ) AS headerresult"   
     +" ORDER BY vend_name, xtindentrole, ponumber, duedate, vendcode_itemnumber", params);
   // find the list object and populate the list with the query results
   _ProgressingList.populate(qry, true);   
   _ProgressingList.expandAll();         
}
function querybypo()
{   
  // get a copy of the params from the getParams function.
  var params = getParams();     
  var qry = toolbox.executeQuery(    
     " SELECT DISTINCT"
     +"  pohead_id AS rowid,"
     +"  poitem_id AS itemid, "   
     +"  pohead_number,"
     +"  vend_number,"   
     +"  vend_name,"     
     +"  ' ' AS ponumber,"
     +"  text(poitem_linenumber) AS poline,"
     +"  item_number AS vendcode_itemnumber,"
     +"  pohead_orderdate AS ordereddate,"
     +"  poitem_duedate AS duedate,"
     +"  poitem_rlsd_duedate AS orignalduedate, "
     +"  CASE"
     +"     WHEN (LENGTH(TRIM(BOTH '	' FROM poitem_vend_item_descrip)) > 0) THEN (poitem_vend_item_descrip)"
     +"     WHEN (LENGTH(TRIM(BOTH '	' FROM item_descrip1)) > 0) THEN (item_descrip1 || ' ' || item_descrip2)"
     +"     ELSE (poitem_comments)"
     +"  END AS vendname_desc,"
     +"  poitem_vend_item_number AS venditemnum,"
     +"  CASE WHEN (poitem_vend_uom LIKE '') THEN (uom_name)"
     +"   ELSE (poitem_vend_uom)"
     +"  END AS uomname,"
     +"  trim(BOTH ' ' FROM to_char(poitem_qty_received - poitem_qty_returned, '9999999999.99')) AS cntname_qtyrecv,"
     +"  trim(BOTH ' ' FROM to_char(poitem_qty_ordered, '9999999999.99')) AS tel_qtyordered,"
     +"  curr_symbol ||  trim(BOTH ' ' FROM to_char(poitem_unitprice, '9999999999.99999')) AS email_cost,"
     +"  curr_symbol ||  trim(BOTH ' ' FROM to_char(poitem_unitprice * poitem_qty_ordered, '9999999999.99')) AS extcost,"
     +"  CASE WHEN COALESCE(expcat_code, prj_number) ISNULL THEN 'INV' "
     +"       ELSE COALESCE(expcat_code, prj_number) END AS expcode, "
     +"  1 as xtindentrole,"
     +"  CASE WHEN (poitem_qty_received - poitem_qty_returned <= 0) THEN 'warning' ELSE null END AS cntname_qtyrecv_qtforegroundrole,"
     +"  CASE WHEN (poitem_duedate <= current_date) THEN 'error' ELSE null END AS duedate_qtforegroundrole,"
     +"  (null) AS qtbackgroundrole"
     +" FROM poitem"
     +" INNER JOIN pohead ON pohead.pohead_id = poitem.poitem_pohead_id"
     +" INNER JOIN vendinfo ON vendinfo.vend_id = pohead.pohead_vend_id"
     +" INNER JOIN curr_symbol ON pohead.pohead_curr_id = curr_symbol.curr_id"    
     +" LEFT OUTER JOIN cntct ON cntct.cntct_id = vendinfo.vend_cntct1_id"
     +" LEFT OUTER JOIN itemsite ON poitem_itemsite_id = itemsite_id"
     +" LEFT OUTER JOIN (item JOIN uom ON (item_inv_uom_id=uom_id)) ON (itemsite_item_id = item_id)"
     +" LEFT OUTER JOIN expcat ON expcat.expcat_id = poitem.poitem_expcat_id "
     +" LEFT OUTER JOIN prj ON prj_id = poitem_prj_id "
     +" WHERE pohead_status = 'O'"
     +" AND poitem_status = 'O'"
     +" AND poitem_qty_received - poitem_qty_returned < poitem_qty_ordered"
     +" <? if exists(\"overdue\") ?>"      
     +"    AND poitem_duedate < current_date" 
     +" <? elseif exists(\"duein2weeks\") ?>"      
     +"    AND poitem_duedate BETWEEN date(current_date)"
     +"    AND date(current_date + 14)"
     +" <? elseif exists(\"duedatestart\") ?>" 
     +"    AND poitem_duedate BETWEEN date(<? value(\"duedatestart\") ?>)"
     +"    AND date(<? value(\"duedateend\") ?>)"       
     +" <? endif ?>" 
     +" <? if exists(\"order2weeks\") ?>" 
     +"    AND pohead_orderdate < date(current_date - 14)" 
     +" <? elseif exists(\"dueDateChanged\") ?>"      
     +"    AND NOT poitem_rlsd_duedate = poitem_duedate "
     +" <? elseif exists(\"orderdatestart\") ?>" 
     +"    AND pohead_orderdate BETWEEN date(<? value(\"orderdatestart\") ?>)"
     +"    AND date(<? value(\"orderdateend\") ?>)"       
     +" <? endif ?>" 
     +" <? if exists(\"expcatid\") ?>" 
     +"    AND poitem_expcat_id = <? value(\"expcatid\") ?> "        
     +" <? endif ?> "  
     +" <? if exists(\"expcattext\") ?> " 
     +"    AND COALESCE(expcat_code, prj_number) LIKE <? value(\"expcattext\") ?>  || '%' " 
     +" <? endif ?>"
     +" <? if exists(\"username\") ?> "  
     +"    AND poitem_id IN (SELECT poreqitem_poitem_id "
     +"                        FROM poreq.poreqitem, poreq.poreqhead "
     +"                       WHERE poreqitem_poreqhead_id = poreqhead_id "
     +"                         AND poreqhead_username = <? value(\"username\") ?>) "
     +" <? endif ?>" 
     +" <? if exists(\"woID\") ?> " 
     +"    AND itemsite_id IN (SELECT itemsite_id "
     +"                     FROM womatl, itemsite "
     +"                    WHERE itemsite_id = womatl_itemsite_id "  
     +"                      AND ((itemsite_qtyonhand - qtyAllocated(itemsite_id, womatl_duedate)) < 0 "
     +"                       OR  (itemsite_qtyonhand - " 
     +"                            noNeg(itemuomtouom(itemsite_item_id, womatl_uom_id, NULL, womatl_qtyreq - " 
     +"                            womatl_qtyiss))) < 0) "     
     +"                      AND womatl_wo_id = <? value(\"woID\") ?>) "
     +" <? endif ?>"
     +" UNION"         
     +"  SELECT *"
     +"  FROM("     
     +"   SELECT DISTINCT"
     +"     pohead_id AS rowid," 
     +"     -1 AS itemid, "   
     +"     pohead_number,"
     +"     vend_number,"   
     +"     vend_name,"     
     +"     text(pohead_number) AS ponumber,"
     +"     text('') AS poline," 
     +"     vend_number AS vendcode_itemnumber,"
     +"     min(pohead_orderdate) AS ordereddate,"
     +"     min(poitem_duedate) AS duedate,"
     +"     min(poitem_rlsd_duedate) AS orignalduedate, "
     +"     text(vend_name) AS vendname_desc,"
     +"     text(' ') AS venditemnum,"
     +"     text('') AS uomname,"
     +"     text(cntct_first_name || ' ' || cntct_last_name) AS cntname_qtyrecv,"
     +"     text(cntct_phone) AS tel_qtyordered,"
     +"     text(cntct_email) AS email_cost,"
     +"     curr_symbol ||  trim(BOTH ' ' FROM to_char(sum(poitem_unitprice * poitem_qty_ordered), '9999999999.99')) AS extcost,"
     +"     text('') AS expcode, "
     +"     0 as xtindentrole,"
     +"    (null) AS cntname_qtyrecv_qtforegroundrole,"
     +"    (null) AS duedate_qtforegroundrole,"
     +"    text('lightskyblue') AS qtbackgroundrole"
     +"   FROM poitem"
     +"   INNER JOIN pohead ON pohead.pohead_id = poitem.poitem_pohead_id"
     +"   INNER JOIN vendinfo ON vendinfo.vend_id = pohead.pohead_vend_id"  
     +"   INNER JOIN curr_symbol ON pohead.pohead_curr_id = curr_symbol.curr_id"     
     +"   LEFT OUTER JOIN cntct ON cntct.cntct_id = vendinfo.vend_cntct1_id"
     +"   LEFT OUTER JOIN itemsite ON poitem_itemsite_id = itemsite_id"
     +"   LEFT OUTER JOIN (item JOIN uom ON (item_inv_uom_id=uom_id)) ON (itemsite_item_id = item_id)"
     +"   LEFT OUTER JOIN expcat ON expcat.expcat_id = poitem.poitem_expcat_id "
     +"   LEFT OUTER JOIN prj ON prj_id = poitem_prj_id "
     +"   WHERE pohead_status = 'O'"
     +"   AND poitem_status = 'O'"
     +"   AND poitem_qty_received - poitem_qty_returned < poitem_qty_ordered"   
     +" <? if exists(\"overdue\") ?>"      
     +"    AND poitem_duedate < current_date" 
     +" <? elseif exists(\"duein2weeks\") ?>"      
     +"    AND poitem_duedate BETWEEN date(current_date)"
     +"    AND date(current_date + 14)"
     +" <? elseif exists(\"dueDateChanged\") ?>"      
     +"    AND NOT poitem_rlsd_duedate = poitem_duedate "
     +" <? elseif exists(\"duedatestart\") ?>" 
     +"    AND poitem_duedate BETWEEN date(<? value(\"duedatestart\") ?>)"
     +"    AND date(<? value(\"duedateend\") ?>)"       
     +" <? endif ?>" 
     +" <? if exists(\"order2weeks\") ?>" 
     +"    AND pohead_orderdate < date(current_date - 14)" 
     +" <? elseif exists(\"orderdatestart\") ?>" 
     +"    AND pohead_orderdate BETWEEN date(<? value(\"orderdatestart\") ?>)"
     +"    AND date(<? value(\"orderdateend\") ?>)"        
     +" <? endif ?>" 
     +" <? if exists(\"expcatid\") ?> " 
     +"    AND poitem_expcat_id = <? value(\"expcatid\") ?> "        
     +" <? endif ?>"   
     +" <? if exists(\"expcattext\") ?> " 
     +"    AND COALESCE(expcat_code, prj_number) LIKE <? value(\"expcattext\") ?>  || '%' " 
     +" <? endif ?>"
     +" <? if exists(\"username\") ?> "  
     +"    AND poitem_id IN (SELECT poreqitem_poitem_id "
     +"                        FROM poreq.poreqitem, poreq.poreqhead "
     +"                       WHERE poreqitem_poreqhead_id = poreqhead_id "
     +"                         AND poreqhead_username = <? value(\"username\") ?>) "
     +" <? endif ?>"
     +" <? if exists(\"woID\") ?> " 
     +"    AND itemsite_id IN (SELECT itemsite_id "
     +"                     FROM womatl, itemsite "
     +"                    WHERE itemsite_id = womatl_itemsite_id "  
     +"                      AND ((itemsite_qtyonhand - qtyAllocated(itemsite_id, womatl_duedate)) < 0 "
     +"                       OR  (itemsite_qtyonhand - " 
     +"                            noNeg(itemuomtouom(itemsite_item_id, womatl_uom_id, NULL, womatl_qtyreq - " 
     +"                            womatl_qtyiss))) < 0) "     
     +"                      AND womatl_wo_id = <? value(\"woID\") ?>) "
     +" <? endif ?>"
     +"   GROUP BY pohead_id, vend_number, vend_name,"
     +"     ponumber, poline, vendcode_itemnumber,"
     +"     vendname_desc, venditemnum, "
     +"     uomname, cntname_qtyrecv, tel_qtyordered,"
     +"     curr_symbol, expcode, email_cost, xtindentrole,"
     +"     cntname_qtyrecv_qtforegroundrole,"
     +"     duedate_qtforegroundrole, qtbackgroundrole"
     +"       ) AS headerresult"  
     +" ORDER BY pohead_number, vend_name, xtindentrole, duedate, vendcode_itemnumber", params);
   // find the list object and populate the list with the query results
   _ProgressingList.populate(qry, true);   
   _ProgressingList.expandAll();         
}

// This function executes a query and passes the results of that query
// to the list object for populating the list.
function query()
{
  if(_itemByVendorRB.checked)
    querybyvendor();    
  else
    querybypo();
}


function viewPO()
{
  // open an in built window
  var childwnd = toolbox.openWindow("purchaseOrder", 0, 0, 0); 
  var params = new Object;
  params.pohead_id = _ProgressingList.id();
  params.mode    = "view";  
  var tmp = toolbox.lastWindow().set(params); 
}

function editPO()
{
  // open an in built window
  var childwnd = toolbox.openWindow("purchaseOrder", 0, 0, 0); 
  var params = new Object;
  params.pohead_id = _ProgressingList.id();
  params.mode    = "edit";  
  var tmp = toolbox.lastWindow().set(params);  
}

function viewPOItem()
{
  // open an in built window
  var childwnd = toolbox.openWindow("purchaseOrderItem", 0, 0, 0); 
  var params = new Object;
  params.pohead_id = _ProgressingList.id();
  params.poitem_id = _ProgressingList.altId();
  params.mode    = "view";  
  var tmp = toolbox.lastWindow().set(params); 
  var execval = childwnd.exec(); 
}

function editPOItem()
{
  // open an in built window
  var childwnd = toolbox.openWindow("purchaseOrderItem", 0, 0, 0); 
  var params = new Object;
  params.pohead_id = _ProgressingList.id();
  params.poitem_id = _ProgressingList.altId();
  params.mode    = "edit";  
  var tmp = toolbox.lastWindow().set(params);  
  var execval = childwnd.exec();
}
       
// This function will call the print engine for a specified report name
// and using the provided parameters.
function print()
{
 if(_itemByVendorRB.checked)
    toolbox.printReport("ProgressingByVendor", getParams(), true);
  else
    toolbox.printReport("ProgressingByPO", getParams(), true);
}

function printPOVend()
{
 var params = getParams(); 
 if(_itemByVendorRB.checked)
 {
    params.poListID = _ProgressingList.id();
    var poheadqry = toolbox.executeQuery(
    " SELECT "   
    +" pohead_vend_id"    
    +" FROM pohead"    
    +" WHERE pohead_id = <? value(\"poListID\") ?>", params);
    if(poheadqry.first())
    {
       params.vend_id = poheadqry.value("pohead_vend_id");
       toolbox.printReport("ProgressingByVendor", params);    
    } 
 }
 else
 {
    params.pohead_id = _ProgressingList.id(); 
    toolbox.printReport("ProgressingByPO", params);
 }
}

//fill right click list
function itemListMenuFill()
{

  if(_ProgressingList.id() > 0)
  {
    if(enableViewPO)
    {	
  	var action2 = this._menu.addAction("View PO...");
	action2.triggered.connect(viewPO);
    }
    if(_ProgressingList.altId() > 0)
    {
      if(enableViewPO)
      {	
  	  var action4 = this._menu.addAction("View PO Item...");
  	  action4.triggered.connect(viewPOItem);
      }
      if(enableEditPO)
      {
	  var action5 = this._menu.addAction("Edit PO Item...");
	  action5.triggered.connect(editPOItem);
      }  
    } 
    if(_itemByVendorRB.checked)
    { 
        this._menu.addSeparator();
        var action6 = this._menu.addAction("Print by Vendor...");
	action6.triggered.connect(printPOVend);
    } 
    else
    {
        this._menu.addSeparator();
        var action7 = this._menu.addAction("Print by PO...");
	action7.triggered.connect(printPOVend);
    }
  }
}

// Update Query After Selection
_dueDateBack.setStartNull("First", mainwindow.startOfTime(), true);
_dueDateBack.setEndNull("Last", mainwindow.endOfTime(), true);
_orderDateBack.setStartNull("First", mainwindow.startOfTime(), true);
_orderDateBack.setEndNull("Last", mainwindow.endOfTime(), true);
_close.clicked.connect(mywindow, "close");
_query.clicked.connect(query);
_print.clicked.connect(print);
_ProgressingList["newId(int)"].connect(fillCommentDetails);
_expCode["newId(int)"].connect(query);
_new.clicked.connect(newComment);
_next.clicked.connect(nextComment);
_prev.clicked.connect(previousComment);
_ItemsByPORB.clicked.connect(query);
_itemByVendorRB.clicked.connect(query);
_reqUserName["currentIndexChanged(int)"].connect(query);
_woCB["currentIndexChanged(int)"].connect(query);
_allDueRB.clicked.connect(query);
_overdueRB.clicked.connect(query);
_dueIn2WeeksRB.clicked.connect(query);
_dueDateRB.clicked.connect(query);
_dueDateBack.updated.connect(query);
_allOrderRB.clicked.connect(query);
_order2weekRB.clicked.connect(query);
_dueDateChanged.clicked.connect(query);
_orderDateRB.clicked.connect(query);
_orderDateBack.updated.connect(query);
_expCodeFree["textChanged(QString)"].connect(query);
_useExpCode.clicked.connect(query);
_useExpCodeFree.clicked.connect(query);

// the first argument is column name
// the second argument is column width in pixels
// the third argument is default column alignment See Qt::Alignment documentation
// the fourth optional argument is default visible
// the fifth optional argument is column name for enhanced processing
_ProgressingList.addColumn("Vendor Code | Item#", 130, 1, true, "vendcode_itemnumber");
_ProgressingList.addColumn("PO#", 45, 4, true, "ponumber");
_ProgressingList.addColumn("Line#",40,4, true, "poline");
_ProgressingList.addColumn("Vendor | Desc", 200, 1, true, "vendname_desc");
_ProgressingList.addColumn("Vender Item#", 110, 4, true, "venditemnum");
_ProgressingList.addColumn("Contact | Qty Recv", 110, 2, true, "cntname_qtyrecv");
_ProgressingList.addColumn("Tel# | Qty Ord", 120, 2, true, "tel_qtyordered");
_ProgressingList.addColumn("UOM", 40,4 , true, "uomname"); 
_ProgressingList.addColumn("Email | Cost", 120, 2, true, "email_cost");
_ProgressingList.addColumn("Ext Cost",110, 2, true, "extcost");
_ProgressingList.addColumn("Ordered Date", 75, 4, true, "ordereddate");
_ProgressingList.addColumn("Orgl Due Date", 75, 4, true, "orignalduedate");
_ProgressingList.addColumn("Due Date", 65, 4, true, "duedate");
_ProgressingList.addColumn("Exp/Prj#", 65, 4, true, "expcode");
_ProgressingList["populateMenu(QMenu*,QTreeWidgetItem*,int)"].connect(_ProgressingList, itemListMenuFill);

//Check Comment Privilege When Screen is opened 
var prvqry = toolbox.executeQuery("SELECT checkPrivilege('MaintainPurchaseOrders') AS enableeditpo, "
+" checkPrivilege('ViewPurchaseOrders') AS enableviewpo ", -1);
if(prvqry.first())
{
  //enableEditPO = prvqry.value("enableeditpo");
  enableEditPO = prvqry.value("enableeditpo");
  enableViewPO = prvqry.value("enableviewpo");
  enableCommentEdit = prvqry.value("enableviewpo");  
}

var reqchkqry = toolbox.executeQuery("select exists (select * from pg_catalog.pg_namespace where nspname = 'poreq') AS reqexists");
if(reqchkqry.first())
{
   if(reqchkqry.value("reqexists"))
   {
     _expCode.setEnabled(true);
     _reqUserName.setEnabled(true);
   }
   else
   {
      _expCode.setEnabled(false);
      _reqUserName.setEnabled(false);
   }
}
else
{
   _expCode.setEnabled(false);
   _reqUserName.setEnabled(false);
}


_woCB.populate(
"SELECT wo_id, wo_number || '-' || wo_subnumber || ':' || item_descrip1 || ' ' || item_descrip2 AS col1, "
+"       text('') AS col2 "
+" FROM wo, item, itemsite "
+"WHERE item_id = itemsite_item_id "
+"  AND itemsite_id = wo_itemsite_id "
+"  AND wo_status IN ('E','O','R','I') ");