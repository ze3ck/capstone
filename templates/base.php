<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Hola</title>
  <link rel="stylesheet" href="/testComponentes/assets/css/style.css">
</head>

<body>
  <!-- sidebar.php -->
  <?php include __DIR__ . '/../components/sidebar.php'; ?>
  <main>
    <?php echo $content; ?>
  </main>
  <!-- footer -->
  <?php include __DIR__ . '/../components/footer.php'; ?>
</body>

</html>